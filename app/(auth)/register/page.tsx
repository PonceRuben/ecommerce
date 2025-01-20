import FormRegister from "@/components/FormRegister";

function RegisterPage() {
  return (
    <>
      <div className="w-full min-h-screen bg-[#01141f] flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-[#02242d] p-8 rounded-lg shadow-lg">
          <FormRegister />
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
