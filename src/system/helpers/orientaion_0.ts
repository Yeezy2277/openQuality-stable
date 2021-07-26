export class DetermineOrientation {
  static isPortrait = (orientation: TOrientaion): boolean => {
    return orientation === 'PORTRAIT'
  }

  static isLandscape = (orientation: TOrientaion): boolean => {
    return orientation === 'LANDSCAPE'
  }
}