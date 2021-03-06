import React from 'react';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { onStageSelected } from './../actions/stageSelectorActions';

const mapStateToProps = (state) => {
    return {
        stage: state.stage,
        availableStages: state.availableStages
    };
};

const mapDispatchToProps = {
    onStageSelected
};

export class StageSelector extends React.Component {

    onChangeHandler(event, key, value) {
        this.props.onStageSelected(this.props.availableStages[value]);
    }

    render() {

        const menuItems = this.props.availableStages.map((stage, index) => <MenuItem value={index} primaryText={stage}
                                                                                     key={"stage_selector_item_" + index}/>);
        const selectedStageIndex = this.props.availableStages.indexOf(this.props.stage);

        return (
          <DropDownMenu style={{ zIndex: 999, position: 'absolute', top: '0.5em', right: '0.5em' }}
                        value={selectedStageIndex} onChange={this.onChangeHandler.bind(this)}>
              {menuItems}
          </DropDownMenu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StageSelector);