// import { Injectable }    from '@angular/core';
// import { Observable }    from 'rxjs';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/delay';
// import {NgbModal, NgbModalOptions, NgbActiveModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// import {Component, Input, OnInit, ApplicationRef, ChangeDetectorRef} from '@angular/core';

// @Component({
//   template: `
//     <div class="modal-header">
//       <h4 class="modal-title">{{ title }}</h4>
//       <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
//         <span aria-hidden="true">&times;</span>
//       </button>
//     </div>
//     <div class="modal-body">
//       <p>{{message}}</p>
//     </div>
//     <div class="modal-footer">
//       <button type="button" class="btn btn-secondary" (click)="activeModal.close(false)">Cancel</button>
//       <button type="button" class="btn btn-secondary" (click)="activeModal.close(true)">Ok</button>
//     </div>
//   `
// })

// export class DialogComponent implements OnInit {
//   @Input() title;
//   @Input() message;

//   constructor(public activeModal: NgbActiveModal, public changeRef: ChangeDetectorRef) {
//   }
  
//   ngOnInit() {
//   }
// }

// @Injectable()
// export class DialogService {
  
//   constructor(public modalService: NgbModal) {}
  
//   public confirm(title:string, message:string) {
//     const modalRef = this.modalService.open(DialogComponent);
//     modalRef.componentInstance.title = title;// "Discard Changes?";
//     modalRef.componentInstance.message = message;//"Are you sure you want to discard your changes?";
//     modalRef.componentInstance.changeRef.markForCheck();
//     return modalRef.result;
//   }
// }