import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        harga: "",
        id_kategori: "",
    })
    const [loading, setLoading] = useState(true);
    const [kategori, setKategori] = useState([]);
    const [fileBaru, setFileBaru] = useState(null);

    useEffect(() => {
        const getKategori = async () => {
            try {
                const res = await fetch("http://localhost:5000/kategori");
                const data = await res.json();
                setKategori(data);
            } catch (err) {
                console.error("Gagal mengambil kategori:", err);
            }
        };

        getKategori();
    }, []);

    useEffect(() => {
        fetch(`http://localhost:5000/produk/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData(data[0]); // ambil data pertama hasil query
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fileBaru && fileBaru.size > 2 * 1024 * 1024) {
            alert("Ukuran file terlalu besar, maksimal 2mb");
            return;
        }

        const data = new FormData();
        data.append("judul", formData.judul);
        data.append("deskripsi", formData.deskripsi);
        data.append("harga", formData.harga);
        data.append("id_kategori", formData.id_kategori);
        if (fileBaru) {
            data.append("file", fileBaru); //hanya kirim kalau ada foto baru
        }

        if (window.confirm("Yakin ingin mengedit produk ini?")) {
            try {
                const res = await fetch(`http://localhost:5000/produk/${id}`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, },
                    body: data,
                });
                if (res.ok) {
                    alert("Produk berhasil diperbarui!");
                    navigate("/produk");
                } else {
                    alert("Gagal mengupdate produk");
                }
            } catch (err) {
                console.error("Error saat update:", err);
                alert("Terjadi kesalahan saat mengupdate data")
            }
        }
    }

    if (loading) {
        return <div className="container mt-4">Loading...</div>
    }

    return (
        <div className="container mt-4">
            <h2>Edit Produk</h2>
            <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        className="form-control"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Harga</label>
                    <input
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan harga"
                        required
                    />
                </div>

                <select
                    className="py-2 mb-3"
                    name="id_kategori"
                    value={formData.id_kategori}
                    onChange={handleChange}
                >
                    <option value="">Pilih Kategori</option>

                    {kategori.map((item) => {
                        return (
                            <option key={item.id_kategori} value={item.id_kategori}>
                                {item.kategori}
                            </option>
                        )
                    })}
                </select>

                <div className="mb-3">
                    <label className="form-label">Foto saat ini</label>
                    <div>
                        {formData.nama_file ? (
                            <img
                                src={`http://localhost:5000/uploads/${formData.nama_file}`}
                                alt="Foto lama"
                                style={{ width: "120px", borderRadius: "8px" }}
                            />
                        ) : (
                            <p>Tidak ada foto</p>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Ganti Foto</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFileBaru(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Simpan Perubahan
                </button>
            </form>
        </div>
    )
};


