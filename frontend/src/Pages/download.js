import React from 'react';

function MechanicalDepartmentPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-500 text-white text-center py-8">
        <h1 className="text-4xl md:text-3xl lg:text-4xl font-bold">IIT Guwahati Mechanical Department</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-lg md:text-xl lg:text-2xl mb-4">Welcome to the Mechanical Department at IIT Guwahati!</p>
        <p className="text-lg md:text-xl lg:text-2xl mb-4">Here, you can download various resources:</p>
        <ul className="list-none">
          <li className="mb-2">
            <a href={`${process.env.REACT_APP_BACKEND_URL}/project/downloadAll`} className="text-blue-600 hover:underline" download>
              Download PDF
            </a>
          </li>
          {/* Add more download links as needed */}
        </ul>
      </main>
    </div>
  );
}

export default MechanicalDepartmentPage;