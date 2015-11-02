let proto = {
    init() {
        console.log('Initing app...');
    }
};

let App = {
    create() {
        return Object.create(proto);
    }
};


export {App};
