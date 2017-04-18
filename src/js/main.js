// global vars

var decrypData=[];
var decrypCategory=[];

$(function () {
	// Filter toggle
	
	$("#filter-toggle").on('click', function() {
	
		$("#filter").toggle();
	});

	$(window).on('resize', resizeFunc);

	function resizeFunc() {
		if( $(window).width() > 786) $("#filter").removeAttr('style');
	}


	// displaying City elements

	var cityTempl = $('#cityTempl').html();
	var cityContent = tmpl(cityTempl,City) ;

	$("#filter-city").append(cityContent);

	// displaying Category elements
	mapCategory();
	var categoryTempl = $('#categoryTempl').html();
	var categoryContent = tmpl(categoryTempl,decrypCategory) ;

	$("#filter-category").append(categoryContent);


	// displaying Data elements
	mapData();
	var dataTempl = $('#dataTempl').html();
	var dataContent = tmpl(dataTempl,decrypData) ;

	$("#filter-data").append(dataContent);



// decrypting Data and filling decrypData
	function mapData() {
	
		Data.forEach(function (item, i, arr){
			var newItem = $.extend(true, {}, item);
			decrypData.push(newItem);
		});

		decrypData.map(function (item, i, arr){
			item.city = getCityName(item.city);
			item.category = getCategoryName(item.category);
		});

	}	


	function getCityName(argId) {
		for (var i =0; i < City.length; i++) {
			if(City[i].id == argId){				
				return City[i].name;
			}
		}
	}

	function getCategoryName(argId) {
		for (var i = 0; i < Category.length; i++) {
			if(Category[i].id == argId){				
				return Category[i].name;
			}
		}
	}



// decrypting Category and filling decrypCategory
	function mapCategory() {
		Category.forEach(function (item, i, arr){
			decrypCategory.push(item);
			item.count = 0;
			item.count = getCategoryCount(item.id, item.count);
		});
	}

	function getCategoryCount(id, count) {
		for (var i =0; i < Data.length; i++) {
			if(Data[i].category == id){		
				count++;
			}
		}
		return count;
	}






// form processing


$( "form" ).on( "submit", function( event ) {

  event.preventDefault();
  var formResult = $(this).serializeArray();
	var filterCity=[];
	var filterCategory=[];
	console.log(formResult);

	formResult.forEach(function (item, i, arr){
		if(formResult.length ==1){
			getFilterCity( (parseInt(item.value)) );
			console.log(filterCity);

			filterCity.forEach(function (item, i, arr){
				filterCategory.push(item);
			});
			console.log(filterCategory);
		} else {

			if(item.name == 'city'){
				getFilterCity( (parseInt(item.value)) );
			}else if(item.name == 'category'){
				getFilterCategory( (parseInt(item.value)) );
			}			
		}
		
	});

// filter by city name
	function getFilterCity(filterValue){

		Data.forEach(function(item, i, arr) {
			if (item.city === filterValue) {
				var newItem = $.extend(true, {}, item);
				filterCity.push(newItem);	
			}
		});
	}

// filter by category name
	function getFilterCategory(filterValue){

		filterCity.forEach(function(item, i, arr) {
			if (item.category === filterValue) {
				var newItem = $.extend(true, {}, item);
				filterCategory.push(newItem);	
			}
		});
	}



	filterCategory.map(function (item, i, arr){
		item.city = getCityName(item.city);
		item.category = getCategoryName(item.category);
	});

// displaying filtered elements

	$("#filter-data").children().remove();
	addElements();
	
	function addElements(){

		if( filterCategory.length > 0){
			decrypData = filterCategory;
			dataContent = tmpl(dataTempl, decrypData);
			// console.log(filterCategory);
		} else if (filterCategory.length == 0){
			dataContent = '<p>There is no matched elements</p>';
			// console.log(filterCategory);
		}

		$("#filter-data").append(dataContent);
	}

});



// get min&max values for slider range
	
	function getPrices() {
		var pricesArray = [];

		Data.forEach(	function (item, i, arr) {
			pricesArray.push(item.price);
		});

		return pricesArray;
	}

	function getMinPrice() {
		var minArray = getPrices();
		return Math.min.apply( Math, minArray );
	}

	function getMaxPrice() {
		var maxArray = getPrices();
		return Math.max.apply( Math, maxArray );
	}


// slider range    

	$( "#slider-range" ).slider({
    range: true,
    min: getMinPrice(),
    max: getMaxPrice(),
    values: [0, 250 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    }
  });
  $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
    " - $" + $( "#slider-range" ).slider( "values", 1 ) );


});


