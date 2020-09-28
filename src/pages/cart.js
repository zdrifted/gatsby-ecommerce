import React from 'react'
import Layout from '../components/layout';

// retrieve cart items from localStorage and display them
// add event handlers for changing quantity of each item and deleting items
// pass cart items to Stripe for payment page

class CartItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: props.quantity,
            id: props.id,
            currency: props.currency,
            price: props.price,
            image: props.image,
            name: props.name,
        };
    }
    // we want to add a clickable + and - so that users can update quantity

    // function for converting localStorage from a str to array and vice versa

    // function for updating localStorage cart

    increment = () => {
        this.setState({
            quantity: this.state.quantity + 1
        });
    };

    decrement = () => {
        if (this.state.quantity === 0) {
            return;
        }

        this.setState({
            quantity: this.state.quantity - 1
        });
    };

    render() {
        // this has to do with formatting the price info
        const { currency, price, image, name } = this.props;

        const priceFloat = (price / 100).toFixed(2);
        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumSignificantDigits: 2 }).format(priceFloat);

        return (
            <div className="flex justify-center m-1 p-4">

                <img className="w-32 h-32 rounded object-cover" alt="product" src={image} />
                <p className="text-center"> {name} - {formattedPrice} </p>

                <button onClick={this.decrement} className="m-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded">-</button>

                {this.state.quantity}

                <button onClick={this.increment} className="m-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded">+</button>

            </div>
        )
    }
}

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            empty: false,
        };
    }

    componentDidMount() {
        this.stripe = window.Stripe('pk_test_pSDUVreHtj3yJTvIGs2mtF1g00xJKPeSKp');

        let str = localStorage.getItem('cart');

        if (str === null) {

            this.setState({
                empty: true
            });

            return;

        }

        let arr = JSON.parse(str);

        console.log('arr: ', arr);

        this.setState({
            cart: arr,
        });

    }

    handleSubmit(cart) {
        // filter state so only sku and quantity remain
        let filteredCart = cart.map((item) => {
            return { sku: item.id, quantity: item.quantity }
        });

        return event => {
            event.preventDefault();

            this.stripe
                .redirectToCheckout({
                    // format for sending purchase data to stripe
                    // items: [{ sku, quantity: 1 }],

                    items: filteredCart,

                    // Do not rely on the redirect to the successUrl for fulfilling
                    // purchases, customers may not always reach the success_url after
                    // a successful payment.
                    // Instead use one of the strategies described in
                    // https://stripe.com/docs/payments/checkout/fulfillment
                    successUrl: 'https://ecommerce-gatsbyjs.netlify.com/success',
                    cancelUrl: 'https://ecommerce-gatsbyjs.netlify.com/canceled',
                })
                .then(function (result) {
                    if (result.error) {
                        // If `redirectToCheckout` fails due to a browser or network
                        // error, display the localized error message to your customer.
                        var displayError = document.getElementById('error-message');
                        displayError.textContent = result.error.message;
                    }
                });
        }
    }

    render() {

        if (this.state.empty) {

            return (<Layout><div>Empty</div></Layout>)

        }

        return (
            <Layout>
                <div className="flex flex-col  my-20">
                    {this.state.cart.map((item) =>
                        <CartItem
                            key={item.id}
                            id={item.id}
                            currency={item.currency}
                            price={item.price}
                            image={item.image}
                            name={item.name}
                            quantity={item.quantity}
                        />
                    )}
                    <button onClick={this.handleSubmit(this.state.cart)} className="m-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded">Checkout</button>
                </div>
            </Layout>
        )

    }

}



export default Cart;
