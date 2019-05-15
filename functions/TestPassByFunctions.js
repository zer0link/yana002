export default class TestPassByFunction {

    constructor(component){
        this.component = component;
    }

    Test(value){
        this.component.setState({test:value});
    }
}