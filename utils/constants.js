const defaultCategories = [
  { name: 'Eyeglasses', slug: 'eyeglasses' },
  { name: 'Sunglasses', slug: 'sunglasses' },
  { name: 'Contact Lenses', slug: 'contact-lenses' },
];

module.exports = {
  defaultCategories,
  frameTypes: ['Full Rim', 'Half Rim', 'Rimless'],
  lensTypes: ['Single Vision', 'Bifocal', 'Progressive', 'Polarized'],
  genderTypes: ['Men', 'Women', 'Unisex'],
  orderStatuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
};
