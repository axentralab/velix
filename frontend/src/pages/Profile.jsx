import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function Profile() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-950">Profile</h1>
        <p className="mt-3 text-sm text-slate-600">Update your personal details and contact information.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Input label="Full name" placeholder="Jane Doe" />
          <Input label="Email" type="email" placeholder="jane@example.com" />
          <Input label="Phone" placeholder="(123) 456-7890" />
          <Input label="Address" placeholder="Street, city, country" />
        </div>
        <Button className="mt-8">Save changes</Button>
      </div>
    </div>
  );
}
