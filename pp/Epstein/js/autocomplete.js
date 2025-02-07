"use strict";
function autocomplete() {
	let suggestions = [];
	const srch_itm = document.querySelectorAll("[atr_name]");
	for (let i = 0; i < srch_itm.length; i++) {
		suggestions[i] = srch_itm[i].getAttribute("atr_name");
	}
	// getting all required elements
	const searchWrapper = document.querySelector(".search-input");
	const inputBox = searchWrapper.querySelector("input");
	const suggBox = searchWrapper.querySelector(".autocom-box");
	const icon = searchWrapper.querySelector(".icon");

	// if user press any key and release
	inputBox.onkeyup = (e) => {
		let userData = e.target.value; //user enetered data
		let emptyArray = [];
		if (userData) {
			icon.onclick = () => {
				console.log(userData);
				//now do something
			}
			emptyArray = suggestions.filter((data) => {
				return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
			});
			emptyArray = emptyArray.map((data) => {
				// passing return data inside li tag
				return data = '<li>' + data + '</li>';
			});
			searchWrapper.classList.add("active"); //show autocomplete box
			showSuggestions(emptyArray);
			let allList = suggBox.querySelectorAll("li");
			for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");
			}
		} else {
			searchWrapper.classList.remove("active"); //hide autocomplete box
		}
	}

	function select(element) {
		let selectData = element.textContent;
		inputBox.value = selectData;
		icon.onclick = () => {
			console.log(selectData);
			//now do something
		}
		searchWrapper.classList.remove("active");
	}

	function showSuggestions(list) {
		let listData;
		if (!list.length) {
			userValue = inputBox.value;
			listData = '<li>' + userValue + '</li>';
		} else {
			listData = list.join('');
		}
		suggBox.innerHTML = listData;
	}
}
if ($("[atr_name]").length) {
	autocomplete();
}