const routeList = [
	{
		title: 'All countries',
		route: 'all'
	},
	{
		title: 'Africa',
		route: 'africa'
	},
	{
		title: 'Americas',
		route: 'americas'
	},
	{
		title: 'Asia',
		route: 'asia'
	},
	{
		title: 'Europe',
		route: 'europe'
	},
	{
		title: 'Oceania',
		route: 'oceania'
	}
]

const endPointList = {
	all: 'all',
	capital: 'capital',
	region: 'region',
	name: 'name'
}

const $navBar_list = document.querySelector('.list')
const $select = document.querySelector('.select')
const $searchInput = document.querySelector('.searchInput')
const $container = document.querySelector('.container')
const $loader = document.querySelector('.loader')

function getBase(endPoint, cb){
	fetch(`https://restcountries.com/v3.1/${endPoint}`)
		.then(res => res.json(''))
		.then(res => {
			cb(res)
		})
}

window.addEventListener('load', () => {
	$loader.innerHTML = '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'
	const links = routeList.map(({title, route}) => {
		return routeTemplate(title, route)
	}).join('')

	$navBar_list.innerHTML = links

	getBase(endPointList.all, res => {
		template(res)
	})
})

function routeTemplate(title, route){
	return `
		<li class="">
			<a onclick="getRoute('${route}')" class="nav-link">
				${title}
			</a>
		</li>
	`
}

function getRoute(route){
	console.log(route);
	if(route == 'all'){
		getBase(`${endPointList.all}`, res => {
			console.log(res);
			template(res)
		})
	}else{
		getBase(`${endPointList.region}/${route}`, res => {
			console.log(res);
			template(res)
		})
	}
	
}


function template(res){
	const template = res.map(item => {
		return cardTemplate(item)
	}).join('')

	$container.innerHTML = template
	
}

function cardTemplate(item){
	return `
		<div class="card">
			<div class="card-header">
				<h4>${item.name.common} <span>${item.flag ? item.flag : '...'}</span></h4>
			</div>
			<div class='card-body'>
				<img src="${item.flags.png}">
			</div>
			<div class="card-footer">
				<button onclick="getMore('${item.name.common}')">More</button>
			</div>
		</div>
	`
}

function getMore(more){
	console.log(more);

	getBase(`${endPointList.name}/${more}`, res => {
		const card = res.map(item => {
			return `
				<div class="cardMore">
					<h1>${item.name.common} <span>${item.flag}</span></h1>
					<div class="image">
						<img src="${item.flags.png}">
					</div>
					<div class="info">
						<p>Capital: <span>${item.capital}</span></p>
						<p>Borders: <span>${item.borders}</span></p>
						<p>Car: <span>${item.car.side}</span></p>
						<button class="back" onclick="back()">Back</button>
					</div>
				</div>
			`
		})

		$container.innerHTML = card
		console.log(res)
	})
}

function back(){
	window.location.reload()
}

$select.addEventListener('change', e => {
	const value = e.target.value

	if(value == 'name'){
		$searchInput.setAttribute('placeholder', 'Search by name')
	}else{
		$searchInput.setAttribute('placeholder', 'Search by capital')
	}
})

$searchInput.addEventListener('input', e => {
	const value = e.target.value.toUpperCase()
	const selected = $select.value

	if(selected == 'capital'){
		getBase(`${endPointList.capital}/${value}`, res => {
			template(res)
		})
	}else{
		getBase(`${endPointList.name}/${value}`, res => {
			template(res)
		})
	}
})