var eventBus = new Vue();

// Tabs Component
Vue.component("product-details-tabs", {
  props: {
    details: {
      type: Array,
      required: true,
    },
    shipping: {
      required: true,
    },
  },
  template: `
  <div>
    <span v-for="(tab, index) in tabs" :key="index"
          class="tab"
          :class="{ activeTab: selectedTab===tab }"
          @click="selectedTab = tab">
          {{ tab }}</span>
      <div
        :details="details"
        v-show="selectedTab === 'Details'">
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
      <div v-show="selectedTab === 'Shipping'">
        <p>Shipping: {{ shipping}} </p>
      </div>

  </div>
  `,
  data() {
    return {
      tabs: ["Details", "Shipping"],
      selectedTab: "Details",
    };
  },
});

// Product Reviews Tabs Component
Vue.component("product-review-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
  <div>
    <span v-for="(tab, index) in tabs" :key="index"
          class="tab"
          :class="{ activeTab: selectedTab===tab }"
          @click="selectedTab = tab">
          {{ tab }}</span>
      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are currently no reviews</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
      <product-reviews
                     v-show="selectedTab === 'Make a Review'"></product-reviews>
  </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

// Product Reviews Component
Vue.component("product-reviews", {
  template: `

    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors"> {{ error }} </li>
        </ul>
      </p>

      <p>
        <label for="name">Name: </label>
        <input id="name" v-model="name" />
      </p>

      <p>
        <label for="review">Review: </label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating: </label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
      </p>

      <p>
        <input type="submit" value="submit">
      </p>
    </form>

  `,
  data() {
    return {
      name: null,
      rating: null,
      review: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        this.errors = [];
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    },
  },
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  template: `
  <div class="product">
    <div class="product-image">
        <img v-bind:src="image" />
    </div>

    <div class="product-info">
        <!-- <h1>{{ product }}</h1> -->
        <h1>{{ title }}</h1>
        <!-- <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p> -->
        <p v-if="inventory > 10">In Stock</p>
        <p v-else-if="inventory <= 10 && inventory > 0">
        Almost sold out!
        </p>
        <p v-else :class="{ outOfStockClass: !inStock } ">Out of Stock</p>
        <p v-if="onSale">{{printOnSale}}!</p>
        <p>{{ description }}</p>
        <product-details-tabs :shipping="shipping" :details="details"></product-details-tabs>
        <div
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            v-on:mouseover="updateProductVariant(index)"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor }"
        ></div>
        <div>
        <p>Available sizes:</p>
        <ul>
            <li v-for="size in sizes">
            {{size}}
            </li>
        </ul>
        </div>

        <!-- <a :href="link">More Info</a> -->
        <button
        v-on:click="addToCart"
        :disabled="!inStock"
        :class=" {disabledButton: !inStock} "
        >
        Add to Cart
        </button>

        <button v-on:click="removeFromCart">
            Remove from Cart
        </button>

    </div>
    <div>
      <product-review-tabs :reviews=reviews></product-review-tabs>
    </div>
  </div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      description: "The best socks in town, #pinksocks",
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0,
        },
      ],
      sizes: ["small", "medium", "large", "extra-large"],
      // inStock: false,
      inventory: 0,
      onSale: false,
      // image: "./assets/vmSocks-green-onWhite.jpg",
      selectedVariant: 0,
      link: "https://www.vuemastery.com/courses",
      //   cart: 0,
      outOfStockClass: false,
      reviews: [],
    };
  },
  methods: {
    addToCart: function () {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart: function () {
      //if (this.cart > 0) this.cart -= 1;
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    // updateProductVariant: function (variantImage) {
    //   this.image = variantImage;
    // },
    updateProductVariant: function (index) {
      this.selectedVariant = index;
      //console.log(index);
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    printOnSale() {
      return this.onSale ? this.title : "";
    },
    shipping() {
      return this.premium ? "Free" : 2.99;
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

// Main App
var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      this.cart = this.cart.filter(function (x) {
        if (x !== id) {
          return x;
        }
      });
    },
  },
});
