import AddRentForm from "@/app/components/AddRentForm";

const page = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="w-full p-6 mt-24 text-3xl font-bold font-serif text-center border-b">
        Add Rent
      </h1>
      <AddRentForm />
    </div>
  );
};

export default page;
