import React, { PureComponent } from 'react'
import { 
  TouchableOpacity, 
  View, 
  Image, 
  Text, 
} from 'react-native'
import { 
  styleSheetCreate, 
  style, 
  ImageRepository, 
  Color, 
  fonts,
  windowWidth, 
} from 'app/system/helpers'
import Modal from 'react-native-modal'

interface IProps {
  isModalShow: boolean
  closeModalHandler(): void
}

interface IState {

}

export class ModalSuccessSuggestResearch extends PureComponent<IProps, IState> {

  state = {

  }

  render(): JSX.Element {
    return (
      <Modal
        isVisible={this.props.isModalShow}
        backdropOpacity={0.4}
        onBackdropPress={this.props.closeModalHandler}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Image
            source={ImageRepository.scanProductResearch}
            style={styles.modalImage}
          />
          <Text style={styles.modalTitle}>
            {`Ваш запрос на исследование\nуспешно отправлен`}
          </Text>
          <TouchableOpacity
            onPress={this.props.closeModalHandler}
            style={styles.modalOkContainer}
          >
            <Image
              source={ImageRepository.scanProductSuggestOk}
              style={styles.modalOkImage}
            />
            <Text style={styles.modalOkText}>
              Ок
        </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}
const styles = styleSheetCreate({
  modal: style.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  modalContainer: style.view({
    backgroundColor: Color.white,
    height: windowWidth * 0.9,
    width: windowWidth * 0.75,
    alignItems: 'center',
  }),
  modalImage: style.image({
    marginBottom: windowWidth * 0.07,
    width: windowWidth * 0.18,
    height: windowWidth * 0.23,
    marginTop: windowWidth * 0.1,
  }),
  modalTitle: style.text({
    textAlign: 'center',
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
  }),
  modalOkContainer: style.view({
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.47,
    height: windowWidth * 0.138,
    backgroundColor: Color.spanishBlue,
    flexDirection: 'row',
    marginTop: windowWidth * 0.06,
  }),
  modalOkText: style.text({
    color: Color.white,
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
  }),
  modalOkImage: style.image({
    width: windowWidth * 0.055,
    height: windowWidth * 0.043,
    marginRight: windowWidth * 0.025,
  }),
})