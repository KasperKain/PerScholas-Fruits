const React = require("react");
const DefaultLayout = require("./DefaultLayout");

class Index extends React.Component {
  render() {
    return (
      <DefaultLayout title={"Fruits Index Page"}>
        <ul>
          {this.props.fruits.map((fruit, i) => {
            return (
              <li key={i}>
                The <a href={`/fruits/${fruit.id}`}> {fruit.name} </a> is{" "}
                {fruit.color}
                {fruit.readyToEat
                  ? `. It is ready to eat!`
                  : `. It is not ready to eat!`}
                <form
                  action={`/fruits/${fruit._id}?_method=DELETE`}
                  method='POST'
                >
                  <input type='submit' value='DELETE' />
                  <a href={`/fruits/${fruit._id}/edit`}> Edit This Fruit</a>
                </form>
              </li>
            );
          })}
        </ul>

        <nav>
          <a href='/fruits/new'>Create a New Fruit</a>
        </nav>
      </DefaultLayout>
    );
  }
}

module.exports = Index;
