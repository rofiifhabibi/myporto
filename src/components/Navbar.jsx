const Navbar = () => {
  return (
    <nav className="p-5 bg-black text-white flex justify-between">
      <div className="font-bold stalinist-one-regular">MY LOGO</div>
      <ul className="flex gap-4 montserrat">
        <li>Home</li>
        <li>Projects</li>
      </ul>
    </nav>
  );
};

export default Navbar; // Baris ini WAJIB supaya bisa dipanggil di luar