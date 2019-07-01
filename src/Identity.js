// @flow

import * as React from 'react';

type Props = {
  cleanName: string,
  description: string,
  getValidity: (string, string) => any | false,
  inputProps: ?{
    className?: string,
    onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>) => mixed
  },
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>, boolean) => mixed,
  openLaw: Object,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  email: string,
  validationError: boolean,
};

export class Identity extends React.PureComponent<Props, State> {
  // currently used as a helper to send the parent's "on[Event]" props
  // e.g. if it wants to be sure to do a Collection addition on enter press
  isDataValid = false;

  state = {
    email: '',
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    const { getValidity, name, openLaw, savedValue } = this.props;

    try {
      if (this.props.savedValue) {
        const identity = getValidity(name, savedValue);

        this.setState({
          email: openLaw.getIdentityEmail(identity),
        });
      } else {
        this.setState({
          email: '',
        });
      }
    } catch (error) {
      this.setState({
        email: '',
      });
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { name, openLaw } = this.props;

    try {
      if (!eventValue) {
        this.setState({
          email: '',
          validationError: false,
        }, () => {
          this.props.onChange(name, undefined);

          this.isDataValid = false;
        });
      } else {
        this.setState({
          email: eventValue,
          validationError: false,
        });

        this.props.onChange(
          name,
          openLaw.createIdentityInternalValue('', eventValue),
        );

        this.isDataValid = true;
      }
    } catch (error) {
      this.isDataValid = false;

      this.setState({
        email: eventValue,
        validationError: true,
      });
    }
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event, this.isDataValid);
    }

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable identity">
        <label>
          <span>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={`${this.props.textLikeInputClass}${cleanName} ${cleanName}-email${additionalClassName}${inputPropsClassName}`}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="email"
            value={this.state.email}
          />
        </label>
      </div>
    );
  }
}
