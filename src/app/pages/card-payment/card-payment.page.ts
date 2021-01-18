import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var Stripe;//This is where we declare the stripe variable
 
@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.page.html',
  styleUrls: ['./card-payment.page.scss'],
})
export class CardPaymentPage implements OnInit {

  public item: any = null;
  public montant: any = null;
  stripe = Stripe('pk_test_51H9Ct2EZ6zpiaS1TyLG6gVR78VxbLU9z79Du0Y9yCUmgOmOErD2rDIe2aNx058IXuVZ4qhdfIEZ6uJFrkL9mggnZ00KLHaG8jw');//We also use our publishable key from stripe
  card: any;//Declare this variable for later
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.forEach((d)=>{
      this.item = d.item;
      this.montant = d.montant;
    this.setupStripe();

      
    })
  }

  ngOnInit() {
  }

   
  ionViewDidLoad() {
  }
 
  setupStripe(){
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
 
    this.card = elements.create('card', { style: style });
 
    this.card.mount('#card-element');
 
    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
 
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
 
      // this.stripe.createToken(this.card)
      this.stripe.createSource(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
        }
      });
    });
  }

}
