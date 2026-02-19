import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold tracking-wide text-[#222]">
            ADMIN
          </h1>
          <p className="text-sm text-[#888] mt-1">Sign in to manage content</p>
        </div>
        <div className="bg-white border border-[#eee] rounded-lg p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
