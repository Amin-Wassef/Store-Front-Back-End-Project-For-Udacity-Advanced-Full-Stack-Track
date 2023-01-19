import { productMod, Products } from '../../models/products_m';

// Model instantiation
const products = new Products();

describe('Products model testing', () => {
  describe('Functions existance', () => {
    it('"Create" function should exists', () => {
      expect(products.create).toBeDefined();
    });
    it('"Show all" function should exists', () => {
      expect(products.s_all).toBeDefined();
    });
    it('"Show specific" function should exists', () => {
      expect(products.s_one).toBeDefined();
    });
    it('"Update" function should exists', () => {
      expect(products.up_pdt).toBeDefined();
    });
    it('"Delete" function should exists', () => {
      expect(products.delete).toBeDefined();
    });
  });
  
  describe('Fuctions act properly', () => {
    let create_pdt: productMod;

    it('Create new product', async () => {
      create_pdt = await products.create({
        pdt_name: 'Augmentin 1g Tab',
        pdt_price: '90.25',
      });
      expect(create_pdt.pdt_name).toBe('Augmentin 1g Tab');
      expect(create_pdt.pdt_price).toBe('90.25');
    });

    it(`Show all products' data`, async () => {
      const show_all_pdts = await products.s_all();
      expect(show_all_pdts.length).toBe(1);
    });

    it(`Show specific product's data`, async () => {
      const show_specific_pdt = await products.s_one({
        id: create_pdt.id,
      } as productMod);
      expect(show_specific_pdt.id).toBe(create_pdt.id);
      expect(show_specific_pdt.pdt_name).toBe(create_pdt.pdt_name);
      expect(show_specific_pdt.pdt_price).toBe(create_pdt.pdt_price);
    });

    it(`Update product's data`, async () => {
      const up_pdt = await products.up_pdt({
        id: create_pdt.id,
        pdt_name: create_pdt.pdt_name,
        pdt_price: 95.5,
      } as productMod);
      expect(up_pdt.id).toBe(create_pdt.id);
      expect(up_pdt.pdt_name).toBe(create_pdt.pdt_name);
      expect(up_pdt.pdt_price).toBe('95.50');
    });

    it(`Delete product`, async () => {
      const delete_pdt = await products.delete({
        id: create_pdt.id,
      } as productMod);
      expect(delete_pdt.id).toBe(create_pdt.id);
      expect(delete_pdt.pdt_name).toBe(create_pdt.pdt_name);
      expect(delete_pdt.pdt_price).toBe('95.50');
    });
  });
});
