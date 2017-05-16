const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');

import {Provider} from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";

import MicroserviceFilterBox from "./components/microserviceFilterbox";
import MicroserviceList from "./components/microserviceList";
import MicroserviceMindmap from "./components/microserviceMindmap";
import MicroserviceSnackbar from "./components/microserviceSnackbar";
import AddEditDialog from "./components/addEditDialog";
import MicroserviceDeleteServiceDialog from "./components/microserviceDeleteServiceDialog";
import LoginDialog from "./components/loginDialog";
import store from "./stores/microserviceStore";
import {getRequiredPropertyNames} from "./shared/requiredPropertyUtil";

// see http://www.material-ui.com/#/get-started/installation
injectTapEventPlugin();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            microservices: [],
            consumers: []
        };
    }

    componentDidMount() {

        var client = rest.wrap(mime).wrap(errorCode);
        client({path: '/selavi/services'}).then(response => {
            store.dispatch({
                type: 'FETCH_MICROSERVICES_SUCCESS',
                response: response
            });
        });
        client({path: '/selavi/user'}).then(response => {
            store.dispatch({
                type: 'LOGIN_SUCCESS',
                loggedInUser: response.entity
            });
        });
    }

    render() {

        const serviceBusinessInputFields = {
            "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
            "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true},
            "fdOwner": {label: "Contact Person *", hint: "eg. \"Altmann, Erik\"", required: true, searchEndpoint: "/selavi/person/search"},
            "tags": {label: "Tags", hint: "eg. \"dm-pos-belege, produktdaten\"", required: false},
            "description": {label: "Description", hint: "eg. \"ZKDB Online Echtzeitf\u00e4hig\"", required: false, multiLine: true},
        };

        const serviceTechInputFields = {
            "microserviceUrl": {label: "URL", hint: "eg. \"https://zoe.dm.de\"", required: false},
            "ipAddress": {label: "IP address(es)", hint: "eg. \"172.23.68.213\"", required: false},
            "networkZone": {label: "Network zone", hint: "eg. \"LAN\"", required: false},
            "isExternal": {type: "toggle", label: "External service (eg., not a microservice)"}
        };

        const serviceDocumentationInputFields = {
            "documentationLink": {label: "Link to documentation", hint: "eg. \"https://wiki.dm.de/ZOE\"", required: false, isLink: true},
            "buildMonitorLink": {label: "Link to Build Monitor", hint: "eg. \"https://zoe-jenkins.dm.de\"", required: false, isLink: true},
            "monitoringLink": {label: "Link to Monitoring", hint: "eg. \"https://elk-kibana.dm.de\"", required: false, isLink: true},
            "bitbucketUrl": {label: "Bitbucket URL", hint: "eg. \"https://stash.dm.de/projects/ZOE/repos/zoe\"", required: false, isLink: true}
        };


        const serviceInputTabs = [
            { label: "Business", inputFields: serviceBusinessInputFields },
            { label: "Technical", inputFields: serviceTechInputFields },
            { label: "Documentation", inputFields: serviceDocumentationInputFields }
        ];

        const serviceRequiredProperties = getRequiredPropertyNames(serviceInputTabs);

        const relationBasicFields = {
            "target": {label: "Consumed service", required: true, disabled: true},
            "type": {label: "Type of relation", hint: "eg. \"REST\", \"SOAP\"", required: false}
        };

        const relationInputTabs = [
            { label: "Basic", inputFields: relationBasicFields }
        ];

        return (
            <div className="appcontainer">
                <div className="appheader">
                    <MicroserviceFilterBox serviceRequiredProperties={serviceRequiredProperties}/>
                </div>
                <div className="appcontent">
                    <MicroserviceMindmap serviceRequiredProperties={serviceRequiredProperties}/>
                    <MicroserviceList/>
                </div>
                <div className="appfooter">
                    <MicroserviceSnackbar/>
                    <AddEditDialog inputTabs={serviceInputTabs}
                                                  addMenuMode="ADD_SERVICE"
                                                  editMenuMode="EDIT_SERVICE"
                                                  entityDisplayName="Service"/>
                    <AddEditDialog inputTabs={relationInputTabs}
                                                  addMenuMode="ADD_RELATION"
                                                  editMenuMode="EDIT_RELATION"
                                                  entityDisplayName="Link"/>
                    <MicroserviceDeleteServiceDialog/>
                    <LoginDialog/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('react')
);
