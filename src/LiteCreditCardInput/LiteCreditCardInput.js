import React, { Component, PropTypes } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
} from "react-native";
import LiteCreditCardInputCardIcon from './LiteCreditCardInputCardIcon';

import Icons from "../Icons";
import CCInput from "../CCInput";
import { InjectedProps } from "../connectToState";

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    justifyContent: "center",
  },
  numberInput: {
    width: 300
  },
  expiryInput: {
    width: 90,
  },
  cvcInput: {
    width: 90,
  },
  last4Input: {
    width: 80,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,
    icons: PropTypes.object,

    inputStyle: Text.propTypes.style,
    style: PropTypes.object,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  constructor() {
    super();
    this._renderRightIcon = this._renderRightIcon.bind(this);
  }

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");
  _blurCVC = () => this._blur("cvc");

  _blur = field => {
    if (!field) return;
    this.refs[field].blur();
  }

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  };

  render() {
    const { focused, values: { number }, inputStyle, status: { number: numberStatus } } = this.props;
    const showRightPart = focused && focused !== "number";

    const iconName = this._iconToShow();
    let icon = this.props.icons && this.props.icons[iconName] ? this.props.icons[iconName] : Icons[iconName];

    return (
      <View
        style={[s.container, this.props.style]}
      >
        <LiteCreditCardInputCardIcon
          icon={this.props.leftIcon || icon}
          iconStyle={[s.icon, this.props.iconStyle]}
        />
        <View style={[
          s.leftPart,
          showRightPart ? s.hidden : s.expanded,
        ]}>
          <CCInput
            {...this._inputProps("number")}
            containerStyle={s.numberInput}
          />
        </View>
        {this._renderRightIcon()}

        <View style={[
          s.rightPart,
          showRightPart ? s.expanded : s.hidden,
        ]}>
          <TouchableOpacity
            onPress={this._focusNumber}
            style={s.last4}
          >
            <View
              pointerEvents="none"
            >
              <CCInput
                field="last4"
                value={ numberStatus === "valid" ? number.substr(number.length - 4, 4) : "" }
                inputStyle={[s.input, inputStyle]}
                containerStyle={[s.last4Input]}
              />
            </View>
          </TouchableOpacity>
          <CCInput
            {...this._inputProps("expiry")}
            containerStyle={s.expiryInput}
          />
          <CCInput
            {...this._inputProps("cvc")}
            containerStyle={s.cvcInput}
            onBecomeValid={this._blurCVC}
          />
        </View>
      </View>
    );
  }

  _renderRightIcon() {
    const showRightPart = this.props.focused && this.props.focused !== 'number';

    if (showRightPart) {
      return null;
    }

    return (
      <LiteCreditCardInputCardIcon
        icon={this.props.rightIcon}
        iconStyle={[s.icon, this.props.iconStyle]}
      />
    );
  }
}
