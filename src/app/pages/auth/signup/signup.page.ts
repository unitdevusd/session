import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  private signupForm: FormGroup;
  private contact: any;
  

  
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.signupForm = this.formBuilder.group({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        phoneno: new FormControl('', Validators.nullValidator),
        email: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ]),
        ),
        password: new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.required
        ])),
      });

      this.route.queryParams.subscribe(params => {
        if (params && params.special) {
          this.contact = JSON.parse(params.special);
          this.signupForm.controls['phoneno'].setValue(this.contact);
        }
      });
    }

  ngOnInit() {}

  signUp() {
    this.navigateCheckr(this.signupForm.value);
  }
  navigateCheckr(userMeta: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(userMeta)
      }
    };
    this.router.navigate(['select-role'], navigationExtras);
  }
}
