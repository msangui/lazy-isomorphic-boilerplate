import React, {Component, PropTypes} from 'react';

export default
class FormInput extends Component {
    static propTypes = {
        autoComplete: PropTypes.string,
        children: PropTypes.element,
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        onBlur: PropTypes.func,
        onChange: PropTypes.func.isRequired,
        onFocus: PropTypes.func,
        type: PropTypes.string.isRequired,
        value: PropTypes.any
    }

    onChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        const {autoComplete = 'on', onBlur, onFocus, name, value, label, type } = this.props;

        return (
            <div className="form-group">
                <input className="form-control"
                       type={type}
                       onChange={this.onChange.bind(this)}
                       onFocus={onFocus.bind(this)}
                       onBlur={onBlur.bind(this)}
                       name={name}
                       placeholder={label}
                       value={value}
                       autoComplete={autoComplete}/>
                {this.props.children}
            </div>
        );
    }
}
