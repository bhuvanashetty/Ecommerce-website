import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const PrimeDealsSection = () => {
  const [apiDetails, setApiDetails] = useState({
    apiStatus: apiStatusConstants.initial,
    responseData: null,
    errorMsg: null,
  })

  useEffect(() => {
    const getPrimeDeals = async () => {
      // Before the fetch operation, set API status to inProgress
      setApiDetails({
        apiStatus: apiStatusConstants.inProgress,
        responseData: null,
        errorMsg: null,
      })
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/prime-deals'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)
      const fetchedData = await response.json()
      if (response.ok) {
        const formattedData = fetchedData.prime_deals.map(product => ({
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
    getPrimeDeals()
  }, [])

  const renderPrimeDealsListView = () => {
    const {responseData} = apiDetails

    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {responseData.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  const renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="register prime"
      className="register-prime-img"
    />
  )

  const renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderPrimeDeals = () => {
    const {apiStatus} = apiDetails
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderPrimeDealsListView()
      case apiStatusConstants.failure:
        return renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return <>{renderPrimeDeals()}</>
}

export default PrimeDealsSection
