//1
// const CartService = require('../application/CartService');

// describe('CartService - addItem', () => {
//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('should add a new item to cart if not exists', async () => {
//     // Arrange: mock fetchProductDep dan CartRepository.addItem
//     const mockProduct = { id: 2, name: 'Mock Product' };
//     const mockItem = { id: 1, userId: 1, productId: 2, quantity: 3 };

//     // Mock dependency fetchProductDep
//     const mockFetchProduct = jest.fn().mockResolvedValue(mockProduct);

//     // Mock CartRepository.addItem (melalui spyOn module)
//     const spyAddItem = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'addItem').mockResolvedValue(mockItem);

//     // Act
//     const result = await CartService.addItem(1, 2, 3, mockFetchProduct);

//     // Assert
//     expect(mockFetchProduct).toHaveBeenCalledWith(2);
//     expect(spyAddItem).toHaveBeenCalledWith(1, 2, 3);
//     expect(result).toEqual(mockItem);
//   });

//   it('should throw error if product not found', async () => {
//     // Arrange: mock fetchProductDep untuk throw error
//     const mockFetchProduct = jest.fn().mockImplementation(() => {
//       throw new Error('Produk tidak ditemukan di product-service!');
//     });

//     // Act & Assert
//     await expect(
//       CartService.addItem(1, 999, 1, mockFetchProduct)
//     ).rejects.toThrow('Produk tidak ditemukan di product-service!');
//     expect(mockFetchProduct).toHaveBeenCalledWith(999);
//   });
// });

// describe('CartService - getCartByUserId', () => {
//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('should return cart items for given user', async () => {
//     const mockCart = [
//       { id: 1, userId: 1, productId: 2, quantity: 3 }
//     ];
//     const spy = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'getByUserId').mockResolvedValue(mockCart);

//     const result = await CartService.getCartByUserId(1);

//     expect(spy).toHaveBeenCalledWith(1);
//     expect(result).toEqual(mockCart);
//   });
// });

// describe('CartService - removeItem', () => {
//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('should remove item from cart', async () => {
//     const mockResult = { success: true };
//     const spy = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'removeItem').mockResolvedValue(mockResult);

//     const result = await CartService.removeItem(1, 2);

//     expect(spy).toHaveBeenCalledWith(1, 2);
//     expect(result).toEqual(mockResult);
//   });
// });

// describe('CartService - clearCart', () => {
//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('should clear cart for user', async () => {
//     const mockResult = { success: true };
//     const spy = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'clearCart').mockResolvedValue(mockResult);

//     const result = await CartService.clearCart(1);

//     expect(spy).toHaveBeenCalledWith(1);
//     expect(result).toEqual(mockResult);
//   });
// });

//2

// __tests__/cart.test.js

/**
 * Unit Test CartService
 * Fokus: Mock dependency eksternal (product-service dan repository DB)
 * Menggunakan jest.fn() dan jest.spyOn() untuk mengisolasi test pada CartService
 */

const CartService = require('../application/CartService');

//
// --- Unit Test: addItem (dengan Dependency Injection untuk Mock Product-Service) ---
//
describe('CartService - addItem (mock product-service & DB)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add a new item to cart if product is valid (mock product ok)', async () => {
    // Arrange: mock product-service & repository addItem
    const mockProduct = { id: 2, name: 'Mock Product' };
    const mockItem = { id: 1, userId: 1, productId: 2, quantity: 3 };

    // Mock fetchProductDep (simulasi product-service success)
    const mockFetchProduct = jest.fn().mockResolvedValue(mockProduct);
    // Mock repository addItem
    const spyAddItem = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'addItem')
      .mockResolvedValue(mockItem);

    // Act
    const result = await CartService.addItem(1, 2, 3, mockFetchProduct);

    // Assert
    expect(mockFetchProduct).toHaveBeenCalledWith(2);
    expect(spyAddItem).toHaveBeenCalledWith(1, 2, 3);
    expect(result).toEqual(mockItem);
  });

  it('should throw error if product not found (mock product error)', async () => {
    // Arrange: mock fetchProductDep to throw error
    const mockFetchProduct = jest.fn().mockImplementation(() => {
      throw new Error('Produk tidak ditemukan di product-service!');
    });

    // Act & Assert
    await expect(
      CartService.addItem(1, 999, 1, mockFetchProduct)
    ).rejects.toThrow('Produk tidak ditemukan di product-service!');
    expect(mockFetchProduct).toHaveBeenCalledWith(999);
  });
});

//
// --- Unit Test: getCartByUserId (mock DB) ---
//
describe('CartService - getCartByUserId (mock DB)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return cart items for given user', async () => {
    // Arrange: mock repository getByUserId
    const mockCart = [
      { id: 1, userId: 1, productId: 2, quantity: 3 }
    ];
    const spy = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'getByUserId')
      .mockResolvedValue(mockCart);

    // Act
    const result = await CartService.getCartByUserId(1);

    // Assert
    expect(spy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCart);
  });
});

//
// --- Unit Test: removeItem (mock DB) ---
//
describe('CartService - removeItem (mock DB)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should remove item from cart', async () => {
    // Arrange: mock repository removeItem
    const mockResult = { success: true };
    const spy = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'removeItem')
      .mockResolvedValue(mockResult);

    // Act
    const result = await CartService.removeItem(1, 2);

    // Assert
    expect(spy).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual(mockResult);
  });
});

//
// --- Unit Test: clearCart (mock DB) ---
//
describe('CartService - clearCart (mock DB)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should clear cart for user', async () => {
    // Arrange: mock repository clearCart
    const mockResult = { success: true };
    const spy = jest.spyOn(require('../infrastructure/CartRepositorySequelize'), 'clearCart')
      .mockResolvedValue(mockResult);

    // Act
    const result = await CartService.clearCart(1);

    // Assert
    expect(spy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockResult);
  });
});






