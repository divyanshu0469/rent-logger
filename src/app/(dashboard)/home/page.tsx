"use client";

const page = () => {
  return (
    <div className="h-full flex flex-col items-center gap-2">
      <div className="w-full flex h-full p-6 flex-row justify-around items-center font-bold font-serif">
        Welcome To Rent logger
      </div>
      <p>Create tenants and log rents all from a single platform</p>
      <p>Go to Add Rent to log new rent entries</p>
      <p>Go to View Rent to see past entires</p>
    </div>
  );
};

export default page;
