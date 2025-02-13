import { BadgeCheck, LayoutDashboard, ShoppingBasket } from "lucide-react";

export const registerFormControls = [{
  name: 'userName',
  label: 'User Name',
  placeholder: 'Enter your user name',
  componentType: 'input',
  type: 'text',
},
{
  name: 'email',
  label: 'Email',
  placeholder: 'Enter your Email',
  componentType: 'input',
  type: 'email',
},
{
  name: 'password',
  label: 'Password',
  placeholder: 'Enter your password',
  componentType: 'input',
  type: 'password',
}

]

export const loginFormControls = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your Email',
    componentType: 'input',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    componentType: 'input',
    type: 'password',
  }

];


export const addProductformElements = [
  // {
  //   name: 'image',
  //   label: 'Product Image',
  //   placeholder: 'Upload product image',
  //   componentType: 'file',
  //   type: 'file',
  // },
  {
    name: 'title',
    label: 'Title',
    placeholder: 'Enter product title',
    componentType: 'input',
    type: 'text',
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Enter product description',
    componentType: 'textarea',
    type: 'text',
  },
  {
    name: 'category',
    label: 'Category',
    placeholder: 'Select category',
    componentType: 'select',
    options: [
      { value: 'men', label: 'Men' },
      { value: 'women', label: 'Women' },
      { value: 'kids', label: 'Kids' },
      { value: 'accessories', label: 'Accessories' },
      { value: 'footwear', label: 'Footwear' },
    ],
  },
  {
    name: 'brand',
    label: 'Brand',
    placeholder: 'Select brand',
    componentType: 'select',
    options: [
      { value: 'nike', label: 'Nike' },
      { value: 'adidas', label: 'Adidas' },
      { value: 'puma', label: 'Puma' },
      { value: 'samsung', label: 'Samsung' },
      { value: 'apple', label: 'Apple' },
      { value: 'sony', label: 'Sony' },
    ],
  },
  {
    name: 'price',
    label: 'Price',
    placeholder: 'Enter product price',
    componentType: 'input',
    type: 'number',
  },
  {
    name: 'salePrice',
    label: 'Sale Price',
    placeholder: 'Enter sale price (optional)',
    componentType: 'input',
    type: 'number',
  },
  {
    name: 'totalStock',
    label: 'Total Stock',
    placeholder: 'Enter total stock available',
    componentType: 'input',
    type: 'number',
  },
];


export const shoppingViewHeaderMenuItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/shop/home'
  },
  {
    id: 'men',
    label: 'Men',
    path: '/shop/listing'
  },
  {
    id: 'women',
    label: 'Women',
    path: '/shop/listing'
  },
  {
    id: 'kids',
    label: 'Kids',
    path: '/shop/listing'
  },
  {
    id: 'footwear',
    label: 'Footwear',
    path: '/shop/listing'
  },
  {
    id: 'accessories',
    label: 'Accessories',
    path: '/shop/listing'
  },
]

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" }
];

export const categoryOptionsMap = {
  'men': 'Men',
  "women": "Women",
  "kids": "Kids",
  "accessories": "Accessories",
  "footwear": "Footwear"
}

export const brandOptionsMap = {
  "nike": "Nike",
  "adidas": "Adidas",
  "puma": "Puma",
  "bata": "Bata",
  "levi": "Levi",
};


export const filterOptions = {
  Category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" }
  ],
  Brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "bata", label: "Bata" },
    { id: "levi", label: "Levi" }
  ]
};

