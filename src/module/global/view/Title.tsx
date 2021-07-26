import React, { Fragment, PureComponent } from 'react'
import { Text } from 'react-native'
import { styleSheetCreate, style, fonts, Color, windowWidth, } from 'app/system/helpers'
import HTML from 'react-native-render-html'

interface IProps {
  title: string
  isHTMLTitle?: boolean
  
}

interface IState {

}

export class Title extends PureComponent<IProps, IState> {

  state = {

  }

  render(): JSX.Element {
    return (
      <Fragment>
        {
          !this.props.isHTMLTitle 
            ? (
              <Text style={styles.title}>
                {this.props.title}
              </Text>
            )
            : (
              <HTML 
                baseFontStyle={styles.title} 
                html={`<p>${this.props.title}</p>`}
                renderers={{
                  p: (_, children) => <Text style={styles.title}>{children}</Text>
                }} 
              />
            )
        }
      </Fragment>
    )
  }
}
const styles = styleSheetCreate({
  title: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.044,
    textAlign: 'center',
    marginVertical: windowWidth * 0.05,
    marginHorizontal: windowWidth * 0.04,
  }),
})