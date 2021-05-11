import { AbstractBaseComponent } from 'src/app/components/specialized/abstract-base.component';

export class BaseComponent extends AbstractBaseComponent {
    public DB_TABLE = '';
    public errorMessage: any;

    public statusList = [
        {id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'ĐANG HOẠT ĐỘNG'},
        {id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'KHÔNG HOẠT ĐỘNG'},
        {id_trang_thai_hoat_dong: 3, ten_trang_thai_hoat_dong: 'ĐANG XIN GIẤY PHÉP'}
    ];
    // ======================================
    // =========== CRUD FUNCTIONS ===========
    // ======================================
    public prepareData(data) { return data }

    public prepareRemoveData(data) { return data }

    public prepareModDataForEdit(data) { return data }

    public prepareEditData(data) {
        function _compareChangedData(prevData, curData) {
            return Object.keys(curData).reduce((diff, key) => {
                if (prevData[key] === curData[key]) return diff
                return {
                  ...diff,
                  [key]: curData[key]
                }
            }, {});        
        }
        let pKey = {id : data.id};
        let modDatas = _compareChangedData(this.formPrevData, data);
        modDatas = this.prepareModDataForEdit(modDatas);
        let datas = {
            pKey : pKey,
            modDatas : modDatas,
            table: this.DB_TABLE,
        }
        return datas;
    }

    public callService(data) { }

    public callRemoveService(data) {}

    public callEditService(data) {
        this.sctService.UpdateRecord(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    public onCreate() {
        // Must change to async function
        let data = this.formData.value;
        if (this.mode == 'edit') {
            data = this.prepareEditData(data);
            this.callEditService(data);
        }
        else {
            data = this.prepareData(data);
            this.callService(data);
        }
    }

    public onRemove() {
        // Must change to async function
        let data = this.selection.selected;
        data = this.prepareRemoveData(data);
        this.callRemoveService(data);
        this.resetAll();
    }

    // ========================================================
    // =========== ACTIONS FUNCTIONS ===========
    // ========================================================

    public switchView() {
        if (this.view == 'list') {
            this.view = 'form';
        } else {
            // Temporary put the this.ngOnInit()
            this.ngOnInit();
            this.view = 'list';
            this.mode = 'create';
            this.formData.reset();
            this.selection.clear();
            this.autoOpen();
        }
    }

    public switchEditMode() {
        this.mode = 'edit';
        this.switchView();
        this.setFormParams();
        this.formPrevData = this.formData.value;
    }


    public clearTable(event) {
        event.preventDefault();
        this.formData.reset();
    }

    public resetAll(): void {
        this.formData.reset();
        if (this.view == 'form') this.switchView();
        this.selection.clear();
        this.ngOnInit();
    }

    public openRemoveDialog() {
        let self = this;
        this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
            .then(confirm => {
                if (confirm) {
                    self.onRemove();
                    return;
                }
            })
            .catch((err) => console.log('Hủy không thao tác: \n' + err));
    }

    public successNotify(response) {
        if (response.id == -1) {
            this.logger.msgError("Lưu lỗi! Lý do: " + response.message);
        }
        else {
            this.logger.msgSuccess("Dữ liệu được lưu thành công!");
            this.resetAll();
        }
    }

    public errorNotify(error) {
        this.logger.msgError("Không thể thực thi! Lý do: \n" + error);
    }

    // ========================================================
    // =========== FILTERS AND PAGINATION FUNCTIONS ===========
    // ========================================================

    _prepareData() {}

    paginatorAgain() {
        this.paginator._intl.itemsPerPageLabel = "Số hàng";
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
        this.filteredDataSource.paginator = this.paginator;
    }

    filterArray(dataSource, filters) {
        const filterKeys = Object.keys(filters);
        let filteredData = [...dataSource];
        filterKeys.forEach(key => {
            let filterCrits = [];
            if (filters[key].length) {
                filters[key].forEach(criteria => {
                    filterCrits = filterCrits.concat(filteredData.filter(x => x[key] == criteria));
                });
                filteredData = [...filterCrits];
            }
        })
        return filteredData;
    }

    applyFilter(event) {
        if (event.target) {
          const filterValue = (event.target as HTMLInputElement).value;
          this.filteredDataSource.filter = filterValue.trim().toLowerCase();
        } else {
          let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    
          if (!filteredData.length) {
            if (this.filterModel)
              this.filteredDataSource.data = [];
            else
              this.filteredDataSource.data = this.dataSource.data;
          }
          else {
            this.filteredDataSource.data = filteredData;
          }
    
        }
        this._prepareData();
        this.paginatorAgain();
    }
}