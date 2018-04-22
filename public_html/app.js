(function(){
    console.log("angular file is working");

    var CartApp = angular.module("CartApp",[]);

    var english = "";
    var chinese = "";
    var volume = "";
    var price = "";
    var country = "";
    var promo_type="";
    var promo_detail="";
    var promo_item=[];
    var catalogue=[];

    var CartCtrl = function(){
        var CartCtrl = this;
        CartCtrl.item = "";
        CartCtrl.quantity=0;
        CartCtrl.filterText="";
        CartCtrl.basket=[];
        CartCtrl.img="";
        CartCtrl.english = "";
        CartCtrl.chinese = "";
        CartCtrl.volume = "";
        CartCtrl.price = "";
        CartCtrl.country = "";
        CartCtrl.promo_type="";
        CartCtrl.promo_detail="";
        CartCtrl.promo_item=[
          {img: 'assets/image1.jpg', english:'Product 1', chinese:'太阳片', country:'Philippines', promo_type:'New Product', promo_detail: ''}
          ,{img: 'assets/image 2.jpg', english:'Product 2', chinese:'芒果汁', volume:'320 ml', price: 'SGD$ 1000  per carton', country:'Thailand', promo_type:'Promotion', promo_detail: 'Buy 5 cartons get 1 free!'}
          //extend this according to your promotional needs          
        ];

        CartCtrl.catalogue=[
          {img: 'assets/coffee.jpg', english:'Chilled Coffee', chinese:'咖啡', volume:'281 ml', price: 'SGD$ 888  per carton', country:'USA', promo_type:'', promo_detail: ''}
          ,{img: 'assets/mocha.jpg', english:'Mocha', chinese:'巧克力咖啡', volume:'281 ml', price: 'SGD$ 888  per carton', country:'USA', promo_type:'', promo_detail: ''}
          //extend this according to your product needs                
        ];
        


        CartCtrl.removeFromBasket=function(item){
            var idx=CartCtrl.basket.findIndex(function(elem){
                return(item == elem.item)
            })
            if (idx>=0)
                CartCtrl.basket.splice(idx,1);
        }



        
        CartCtrl.addToBasket=function(){
            var idx = CartCtrl.basket.findIndex(function(elem){
                return(elem.item==CartCtrl.item);
            });

        //-1 means null 
        // if index do not exist aka null for the particular product,
        // it is a new item so push it into the basket.
        // If index exists, then add to the existing quantity on basket.
        if (-1 == idx){
            CartCtrl.basket.push({
                item: CartCtrl.item,
                quantity: CartCtrl.quantity
            });
        } else
            CartCtrl.basket[idx].quantity += CartCtrl.quantity;

        //Reset the model
        CartCtrl.item = "";
        CartCtrl.quantity=0;
    
        };


    }

CartApp.controller("CartCtrl",[CartCtrl])
})();





function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validateHuman(honeypot) {
  if (honeypot) {  //if hidden form filled up
    console.log("Robot Detected!");
    return true;
  } else {
    console.log("Welcome Human!");
  }
}

// get all data in form and return object
function getFormData() {
  var form = document.getElementById("gform");
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).filter(function(k) {
        // the filtering logic is simple, only keep fields that are not the honeypot
        return (elements[k].name !== "honeypot");
  }).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append 
                                              // the current checked value to 
                                              // the end of it, along with 
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
                                  // from the  string to make the output 
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  data.formDataNameOrder = JSON.stringify(fields);
  data.formGoogleSheetName = form.dataset.sheet || "sheet_1"; // default sheet name
  data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

  console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var data = getFormData();         // get the values submitted in the form

  /* OPTION: Remove this comment to enable SPAM prevention, see README.md
  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
    return false;
  }
  */

  if( !validEmail(data.email_bypass) ) {   // if email is not valid show error
    document.getElementById("email-invalid").style.display = "block";
    return false;
  } else {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        console.log( xhr.status, xhr.statusText )
        console.log(xhr.responseText);
        document.getElementById("contact").style.display = "none"; // hide form
        document.getElementById("thankyou_message").style.display = "block";
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}
function loaded() {
  console.log("Contact form submission handler loaded successfully.");
  // bind to the submit event of our form
  var form = document.getElementById("gform");
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener("DOMContentLoaded", loaded, false);
