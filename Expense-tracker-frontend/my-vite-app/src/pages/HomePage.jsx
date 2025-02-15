import Navbar from "../components/Navbar"

const HomePage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto">
        <div className="bg-white py-2 w-full  flex justify-between items-center sm:w-full ">
            <div className=" mx-8 sm:mx-16 lg:mx-24 xl:mx-36 text-blue-950 font-bold text-2xl">Expense Wise</div>
        <div className=" flex-grow"><Navbar /> </div>
        <div className="space-x-4  mx-8 sm:mx-16 lg:mx-24 xl:mx-36" >
        <button className="text-blue-600 hover:underline"> <a href="login" className="hover:text-blue-600">Sign in</a></button>
        <button className="bg-blue-300 text-white py-2 px-4 rounded-lg hover:bg-blue-700"><a href="register" className="hover:text-blue-600">Sign up</a></button>
        </div>
    </div>
    <div className="bg-blue-50 h-screen flex flex-col lg:flex-row items-center ">
    <div className="text-center lg:text-left lg:w-1/2  mx-8 sm:mx-16 lg:mx-24 xl:mx-36 mb-4">
        <h1 className="text-6xl font-bold text-blue-950 mb-8">Save money, without thinking about it.</h1>
        <p className="text-gray-600 mb-6">
          Harnessing analytics in your spending and automatically saves the perfect amount every day, so you don’t have to think about it.
        </p>
        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"><a href="register" >Sign up now</a></button>
      </div>

      <div className="justify-center ">
        <img
          src="/file.png"
          alt="Illustration of saving money"
          className="w-300 h-300"
        />
      </div>
    </div>
    </div>
    
  )
}

export default HomePage