/**
 * https://etpinvest.ru/position-size-calculator/
 * z = r / (l * (s - o));
 */

type Params = {
  openPrice: number;
  closePrice: number;
  leverage: number;
  maxLoss: number; // in $
};

const roundLots = (value: number) => Math.floor(value * 100) / 100;

export function calculatePositionSize(params: Params) {
  const rawValue = params.maxLoss / (params.leverage * (params.closePrice - params.openPrice));
  return roundLots(Math.abs(rawValue));
}

// console.log(
//   calculatePositionSize({
//     openPrice: 25.92,
//     closePrice: 25.8,
//     maxLoss: 1,
//     leverage: 100,
//   }),
// );
