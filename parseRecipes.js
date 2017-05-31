var allIngredients = ["Apples", "Cherries", "Honey", "Peaches", "Blueberries", "Lemons", "Broccoli",
					  "Melons", "Carrots", "Strawberries", "Cucumbers", "Pumpkin", "Chili",
					  "Grapes", "Onions", "Tomatoes", "Pepper", "Cabbage", "Oranges", "Coffee"];

function mapByIngredients(ingredientList, cookbook) {
	var ingredientDict = {};
	ingredientList.forEach ( function (ingredient) {
		ingredientDict[ingredient] = cookbook.filter( (recipe) => {
 			if (typeof recipe["ingredients"] != "undefined") {
				var found = recipe["title"].indexOf(ingredient.slice(0, ingredient.length - 1));
				return (found != -1);
			}
			return false;
		})
	});
	console.log(ingredientDict);
	return ingredientDict;
}

function printRecipe(div, crop) {

	var recipe = randomRecipe(crop, recipeByIngredient);

	div.selectAll("p").remove();
	div.selectAll("h3").remove();
	div.selectAll("img").remove();
	div.selectAll("g").remove();

	div.append("p")
	.attr("class", "title")
	.attr("font-size", "3em")
	.text(recipe["title"].toUpperCase());

	div.append("p")
	.attr("class", "title")
	.text(("Ingredients"));

	recipe["ingredients"].forEach( (d) => {
		div.append("p")
		.style("margin-bottom", 0)
		.text(d);
	});

	div.append("p")
	.attr("class", "title")
	.style("margin-top", 10)
	.text(("Directions"));

	recipe["directions"].forEach( (d) => {
		div.append("p")
		.style("margin-bottom", 0)
		.text(d);
	});

	div.selectAll("p").style("margin-left", 15);


}

function randomRecipe(ingredient, cookbook) {
	var chapter = cookbook[ingredient.charAt(0).toUpperCase() + ingredient.slice(1, ingredient.length)];
	return chapter[Math.floor(Math.random() * chapter.length)];
}
