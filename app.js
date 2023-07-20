document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
  
        init() {
          axios
            .get('https://pizza-api.projectcodex.net/api/pizzas')
            .then((result) => {
              this.pizzas = result.data.pizzas
            })
            .then(() => {
              return this.createCart();
            })
            .then((result) => {
              this.cartId = result.data.cart_code;
            });
        },
        featuredPizzas() {
          return axios
            .get('https://pizza-api.projectcodex.net/api/pizzas/featured')
        },
        postfeaturedPizzas() {
          return axios
            .post('https://pizza-api.projectcodex.net/api/pizzas/featured')
        },
  
        createCart() {
          return axios
            .get('https://pizza-api.projectcodex.net/api/pizza-cart/create?username='+ this.username)
        },
  
        showCart() {
          const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
  
          axios
            .get(url)
            .then((result) => {
              this.cart = result.data;
            });
        },
  

        message: 'TRY OUR NEW FLAVOURS LISTED ABOVE OR PLACE YOUR ORDER BELOW.',
        username:'',
        pizzas: [],
        featuredpizzas: [],
        cartId: '',
        cart: { total: 0 },
        paymentMessage: '',
        payNow: false,
        paymentAmount: 0,
        change: 0,
  
        add(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', params)
            .then(() => {
              this.message = "Item Added."
              this.showCart();
              setTimeout(() => {
                this.message = 'Order here.';
              }, 3000);
            })
            .then(() => {
  
              return this.featuredPizzas();
  
            })
            .then(() => {
              return this.postfeaturedPizzas();
            })
            .catch(err => alert(err));
  
        },
        pizzaImage(pizza){
            return `./image/${pizza.size}.png`
        },

        remove(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', params)
            .then(() => {
              this.message = "Item Removed."
              this.showCart();
              setTimeout(() => {
                this.message = 'Order here.';
              }, 3000);
            })
            .catch(err => alert(err));
  
        },
        pay(pizza) {
          const params = {
            cart_code: this.cartId,
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', params)
            .then(() => {

              if(this.username === ''){
                alert('Customer name missing, please enter your name.')
              }
              else if (!this.paymentAmount) {
                this.paymentMessage = 'Please enter enough money.'
                setTimeout(() => {
                  this.paymentMessage = '';
                }, 3000);
              }
              else if (this.paymentAmount >= this.cart.total && this.username !== "") {
                this.paymentMessage = 'Enjoy your pizza(s).'
                this.change = this.paymentAmount - this.cart.total;
                this.message= this.username  +" 's payment was sucessful."
                setTimeout(() => {
                  this.cart.total = 0
                  window.location.reload()
                }, 5000);
  
              } else if (this.paymentAmount < this.cart.total) {
                this.paymentMessage = 'Not enough money entered.'
                setTimeout(() => {
                  this.paymentMessage = '';
                }, 3000);
              }
  
            })
            .catch(err => alert(err));
  
        }
  
      }
    });
  })






