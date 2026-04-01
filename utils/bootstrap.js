const Category = require('../models/Category');
const { defaultCategories } = require('./constants');

const bootstrapDefaults = async () => {
  for (const category of defaultCategories) {
    const exists = await Category.findOne({ slug: category.slug });
    if (!exists) {
      await Category.create(category);
    }
  }
};

module.exports = bootstrapDefaults;
