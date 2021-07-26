import { StyleSheet, ImageStyle, TextStyle, ViewStyle, } from 'react-native'

export const styleSheetFlatten = <T>(styles: T) => {
    return StyleSheet.flatten(styles as any) as any
}

export const styleSheetCreate = <T>(styles: T) => {
    return StyleSheet.create(styles as any) as any
}

export const style = {
    view: (styles: ViewStyle): ViewStyle => styles,
    text: (styles: TextStyle): TextStyle => styles,
    image: (styles: ImageStyle): ImageStyle => styles,
}