/*
 React makes this data flow explicit to make it easy to understand how your program works,
 but it does require a little more typing than traditional two-way data binding.
 */

//ProductRowCategory Component
class ProductCategoryRow extends React.Component {
    render() {
        return (
            <tr>
                <th colSpan="2">{this.props.category}</th>
            </tr>
        )
    }
}

//ProductRow Component
class ProductRow extends React.Component {
    render() {
        //if true ie: in stock
        let name = this.props.product.stocked ? this.props.product.name :
            //else
            <span style={{color: 'tomato'}}>
            {this.props.product.name}
            </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        )
    }
}

//ProductTable Component
class ProductTable extends React.Component {
    render() {
        let rows = [];
        let lastCategory = null;
        let userSearch = null;

        this.props.products.forEach((product) => {

            /*Make it so search is case insensitive ie: 'i'*/
            userSearch = new RegExp(this.props.filterText, 'i');

            /**pass filterText and inStockOnly as a prop*/
            //if not match kill the search
            if (product.name.search(userSearch) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }

            //if not null - push up results
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category}/>);
            }

            //else
            rows.push(<ProductRow product={product} key={product.name}/>);
            lastCategory = product.category;
        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
}

//SearchBar Component
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
        this.handleInStockInputChange = this.handleInStockInputChange.bind(this);
    }

    //handleFilterText()
    handleFilterTextInputChange(e) {
        this.props.onFilterTextInput(e.target.value);
    }

    //handleInStock()
    handleInStockInputChange(e) {
        this.props.onShowOnlyInStockInput(e.target.checked);
    }


    render() {
        return (
            //pass filterText and inStockOnly as a prop
            <form>
                <input
                    className="searchBar"
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    onChange={this.handleFilterTextInputChange}
                />
                <p className="onlyShow">
                    <input
                        type="checkbox"
                        checked={this.props.inStockOnly}
                        onChange={this.handleInStockInputChange}
                    />
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
}

//FilterableProductTable Component
class FilterableProductTable extends React.Component {
    //add initial state
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            inStockOnly: false //set it to false
        };

        this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
        this.handleInStockInput = this.handleInStockInput.bind(this);
    }

    //handleFilterTextInput()
    handleFilterTextInput(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    //handleInStockInput()
    handleInStockInput(inStockOnly) {
        this.setState({ //set to true
            inStockOnly: inStockOnly
        })
    }

    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onFilterTextInput={this.handleFilterTextInput}
                    onShowOnlyInStockInput={this.handleInStockInput}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
}

let PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Volleyball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$499.99', stocked: true, name: 'iPhone 6'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('container')
);

/**
 - The easiest way is to build a version that takes your data model and renders the UI but has no interactivity.
 - It's best to decouple these processes because building a static version requires a lot of typing and no thinking, and adding interactivity requires a lot of thinking and not a lot of typing.
 - You can build top-down or bottom-up. That is, you can either start with building the components higher up in the hierarchy (i.e. starting with FilterableProductTable) or with the ones lower in it (ProductRow).
 - In simpler examples, it's usually easier to go top-down, and on larger projects, it's easier to go bottom-up and write tests as you build.
 */