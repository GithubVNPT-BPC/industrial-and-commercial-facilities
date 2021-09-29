import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'my-app',
    templateUrl: './test.component.html',
    styleUrls: ['./special_layout.scss']
})
export class TestComponent implements OnInit {

    public formDummyData = [
        {
            name: 'akassh',
            phone: ['9517532486', '9517532684']
        },
        {
            name: 'jain',
            phone: ['9517532486', '9517532684']
        }
    ];
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.form = fb.group({
            'user': fb.array([])
        });
    }

    ngOnInit() {
        if (this.formDummyData) {
            this.formDummyData.forEach(user => {
                this.addUser(user);
            });
        } else {
            this.addUser();
        }
    }

    addPhone(userIndex: number, data?: any) {
        console.log('userIndex', userIndex, '-------', 'data', data);
        let fg = this.fb.group({
            'phone': [data ? data : '', Validators.compose([Validators.required])],
        });
        (<FormArray>(<FormGroup>(<FormArray>this.form.controls['user'])
            .controls[userIndex]).controls['phones']).push(fg);

    }

    deletePhone(userIndex: number, index: number) {
        console.log('userIndex', userIndex, '-------', 'index', index);
        (<FormArray>(<FormGroup>(<FormArray>this.form.controls['user'])
            .controls[userIndex]).controls['phones']).removeAt(index);
    }

    addUser(user?: any) {
        let fg = this.fb.group({
            'name': [user ? user.name : '', Validators.compose([Validators.required])],
            'phones': this.fb.array([]),
        });
        (<FormArray>this.form.get('user')).push(fg);
        let userIndex = (<FormArray>this.form.get('user')).length - 1;
        if (!user) {
            this.addPhone(userIndex);
        }
        else {
            user.phone.forEach(phone => {
                this.addPhone(userIndex, phone);
            });
        }
    }

    deleteUser(index: number) {
        (<FormArray>this.form.get('user')).removeAt(index);
    }

    onCancle() {
        this.form.reset();
        console.log(this.form, this.form.value);
    }

    onSubmit(formValue) {
        console.log(formValue);
    }

    ngOnDestroy(): void {
    }
}
