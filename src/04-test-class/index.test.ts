import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initBalance = 1000;
    expect(getBankAccount(initBalance).getBalance()).toEqual(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(1000);
    expect(() => bankAccount.withdraw(1001)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(1000);
    const anotherBankAccount = getBankAccount(200);
    expect(() => bankAccount.transfer(1001, anotherBankAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(200);
    expect(() => bankAccount.transfer(200, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(1000);
    expect(bankAccount.deposit(999).getBalance()).toEqual(1999);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(1000);
    expect(bankAccount.withdraw(999).getBalance()).toEqual(1);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(1000);
    const anotherBankAccount = getBankAccount(200);
    expect(bankAccount.transfer(200, anotherBankAccount).getBalance()).toEqual(
      800,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(77).mockReturnValueOnce(1);

    const bankAccount = getBankAccount(1000);
    const result = await bankAccount.fetchBalance();

    expect(result).toBe(77);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initBalance = 1000;
    const fetchedBalance = 3054;
    const bankAccount = getBankAccount(initBalance);

    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockReturnValue(Promise.resolve(fetchedBalance));

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toEqual(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(1000);

    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockReturnValue(Promise.resolve(null));

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
