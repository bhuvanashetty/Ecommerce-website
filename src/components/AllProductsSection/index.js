import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ProductCard from '../ProductCard'
import FiltersGroup from '../FiltersGroup'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AllProductsSection = () => {
  const [apiDetails, setApiDetails] = useState({
    apiStatus: apiStatusConstants.initial,
    responseData: null,
    errorMsg: null,
  })
  const [activeOptionId, setActiveOptionId] = useState(
    sortbyOptions[0].optionId,
  )
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeRatingId, setActiveRatingId] = useState('')

  useEffect(() => {
    const getProducts = async () => {
      // Before the fetch operation, set API status to inProgress
      setApiDetails({
        apiStatus: apiStatusConstants.inProgress,
        responseData: null,
        errorMsg: null,
      })
      const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
      const jwtToken = Cookies.get('jwt_token')
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      const fetchedData = await response.json()
      if (response.ok) {
        const formattedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        // Set API status to success and store the formatted data
        setApiDetails(prevApiDetails => ({
          ...prevApiDetails,
          apiStatus: apiStatusConstants.success,
          responseData: formattedData,
        }))
      } else {
        // If response is not successful, set API status to failure and store the error message
        setApiDetails(prevApiDetails => ({
          ...prevApiDetails,
          apiStatus: apiStatusConstants.failure,
          errorMsg: fetchedData.error_msg,
        }))
      }
    }

    // Call the async function inside useEffect
    getProducts()
  }, [activeOptionId, activeCategoryId, searchInput, activeRatingId])

  const renderLoadingView = () => (
    <div className='products-loader-container'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </div>
  )

  const renderFailureView = () => (
    <div className='products-error-view-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png'
        alt='all-products-error'
        className='products-failure-img'
      />
      <h1 className='product-failure-heading-text'>
        Oops! Something Went Wrong
      </h1>
      <p className='products-failure-description'>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )
  const changeSortby = optionId => {
    setActiveOptionId(optionId)
  }
  const renderProductsListView = () => {
    const {responseData} = apiDetails
    const shouldShowProductsList = responseData.length > 0

    return shouldShowProductsList ? (
      <div className='all-products-container'>
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
        />
        <ul className='products-list'>
          {responseData.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className='no-products-view'>
        <img
          src='https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png'
          className='no-products-img'
          alt='no products'
        />
        <h1 className='no-products-heading'>No Products Found</h1>
        <p className='no-products-description'>
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  const renderAllProducts = () => {
    const {apiStatus} = apiDetails
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductsListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }
  const clearFilters = () => {
    setSearchInput('')
    setActiveCategoryId('')
    setActiveRatingId('')
  }

  const changeRating = ratingId => {
    setActiveRatingId(ratingId)
  }

  const changeCategory = categoryId => {
    setActiveCategoryId(categoryId)
  }

  const changeSearchInput = input => {
    setSearchInput(input)
  }
  const enterSearchInput = input => {
    setSearchInput(input)
  }

  return (
    <div className='all-products-section'>
      <FiltersGroup
        searchInput={searchInput}
        categoryOptions={categoryOptions}
        ratingsList={ratingsList}
        changeSearchInput={changeSearchInput}
        enterSearchInput={enterSearchInput}
        activeCategoryId={activeCategoryId}
        activeRatingId={activeRatingId}
        changeCategory={changeCategory}
        changeRating={changeRating}
        clearFilters={clearFilters}
      />
      {renderAllProducts()}
    </div>
  )
}

export default AllProductsSection
