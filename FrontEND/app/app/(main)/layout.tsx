import Navbar from "../components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-20"> {/* Add padding top to account for fixed navbar */}
         {children}
      </div>
    </>
  );
}
