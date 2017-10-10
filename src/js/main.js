var SELECTED_ITEMS;

$(function () {

	var _filtersObj;
	var _selectedCategories;
	var _selectedPrices;

	var _filteredByCities;
	var _filteredByCategories;
	SELECTED_ITEMS = [];
	copyData();
	decryptData();

	// displaying City elements
	var cityTempl = $('#cityTempl').html();
	var cityContent = tmpl(cityTempl, City) ;
	$("#filter-city").append(cityContent);

	// displaying Category elements
	var categoryTempl = $('#categoryTempl').html();
	var categoryContent = tmpl(categoryTempl, Category);
	$("#filter-category").append(categoryContent);

	// displaying Category elements
	var dataTempl = $('#dataTempl').html();
	var dataContent = tmpl(dataTempl, SELECTED_ITEMS);
	$("#filter-data").append(dataContent);

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
	  $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );


	//Events
	// Filter toggle
	$("#filter-toggle").on('click', function() {
		$("#filter").toggle();
	});

	$(window).on('resize', resizeFunc);

	// Processing filters form
	$(document).on('submit', '#filter-form', function(e) {
		_selectedCategories = [];
		_selectedPrices = [];

		_filteredByCities=[];
		_filteredByCategories=[];
		SELECTED_ITEMS =[];
		copyData();

		_filtersObj = {
			city: $('#filter-city').find('option:selected').val(),
			category: getCategories(),
			price: getPrice()
		};

		//filter by city id
		$(SELECTED_ITEMS).filter(function( i, item ) {
			if(this.city == +_filtersObj.city || _filtersObj.city === "") {
				return _filteredByCities.push(this);
			}
		});

		//filter by categories id
		$(_filteredByCities).filter(function( i, item ) {
			var that = this;

			if(_filtersObj.category.length){
				$(_filtersObj.category).each(function (i, item) {
					if(that.category === +item) {
						return _filteredByCategories.push(that);
					}
				});
			} else {
				return _filteredByCategories.push(that);
			}
		});

		//filter by min & max prices
		SELECTED_ITEMS =[];
		$(_filteredByCategories).filter(function (i, item) {
			if(item.price >= _filtersObj.price[0] && item.price <= _filtersObj.price[1]){
				return SELECTED_ITEMS.push(item);
			}
		});

		decryptData();
		appendElements();
	});


	// services
	// decrypt data from 'id' to 'name'
	function decryptData() {
		$(SELECTED_ITEMS).each(function (i, item) {
			var selectedItem = item;
			$(City).each(function (i, item) {
				if(selectedItem.city === item.id ){
					selectedItem.city = item.name;
				}
			});

			$(Category).each(function (i, item) {
				if(selectedItem.category === item.id ){
					selectedItem.category = item.name;
				}
			});
		});

		return SELECTED_ITEMS;
	}

	// get selected categories
	function getCategories(){
		var $selectedItems = $('#filter-category').find('input[type="checkbox"]:checked');

		$selectedItems.each(function (i, elem) {
			_selectedCategories.push(+elem.value);
		});

		return _selectedCategories;
	}

	// get selected prices
	function getPrice() {
		var price = $("#amount").val().split(' - ');
		var reg = /\d/g;

		$(price).each(function (i, item) {
			_selectedPrices.push( +(item.replace(/\D/g, "")) );
		});

		return _selectedPrices;
	}

	// addElements();
	function appendElements(){
		$("#filter-data").children().remove();

		if(SELECTED_ITEMS.length > 0){
			dataContent = tmpl(dataTempl, SELECTED_ITEMS);
		} else {
			dataContent = '<p>There are no matched elements</p>'
		}

		$("#filter-data").append(dataContent);

	}

	// get min&max values for slider range
	function getPrices() {
		var pricesArray = [];

		Data.forEach(function (item, i, arr) {
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

	// on resize window
	function resizeFunc() {
		if( $(window).width() > 786) $("#filter").removeAttr('style');
	}

	// clone Data object
	function copyData() {
		Data.forEach(function (item) {
			var newItem = {};
			var newItem=JSON.parse(JSON.stringify(item));
			SELECTED_ITEMS.push(newItem);
		});
	}
});


