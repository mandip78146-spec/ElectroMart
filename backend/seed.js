const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/electrostore';

const Category = mongoose.model('category', new mongoose.Schema({
    Name: String,
    Img: String
}));

const Brand = mongoose.model('Brands', new mongoose.Schema({
    BrandName: String,
    Category: String,
    Img: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    Category: String,
    ProductName: String,
    ProductPrice: Number,
    ProductDetail: String,
    OnSale: String,
    SalePrice: String,
    Date: String,
    AddedBY: String,
    VendorID: String,
    Img: String,
    Brand: String,
    Specifications: String
}));

const categorySeeds = [
    {
        name: 'Laptop',
        image: '1769593919555-laptop.png',
        preferredId: '6970dd60300a757a6dcdb92e'
    },
    {
        name: 'Mobile',
        image: '1769510344717-vivo.png',
        preferredId: '6970dd2d300a757a6dcdb92a'
    },
    {
        name: 'LED TV',
        image: '1770206102115-sonybravia.jpg',
        preferredId: '6970dd16300a757a6dcdb928'
    },
    {
        name: 'AirPods',
        image: '1770372293126-appleairpod2nd.jpeg',
        preferredId: '69849f299a77c6ecd3c2839b'
    }
];

const brandSeeds = [
    ['HP', 'Laptop', '1770039402180-hplogo.png'],
    ['Dell', 'Laptop', '1770039547183-delllogo.png'],
    ['Lenovo', 'Laptop', '1770039883467-download (2).png'],
    ['Samsung', 'Mobile', '1770096335582-samsung.png'],
    ['Vivo', 'Mobile', '1769510344717-vivo.png'],
    ['Realme', 'Mobile', '1770095959503-download (1).png'],
    ['Sony', 'LED TV', '1770096153204-sonylogo.png'],
    ['LG', 'LED TV', '1770096526483-lg.png'],
    ['Samsung', 'LED TV', '1770096500582-sonylogo.png'],
    ['Apple', 'AirPods', '1770372293126-appleairpod2nd.jpeg'],
    ['Boat', 'AirPods', '1770039736882-boatpng.png'],
    ['Noise', 'AirPods', '1770040107464-noiselogo.png']
];

const productSeeds = [
    {
        category: 'Laptop', brand: 'HP', name: 'HP 240R G10 Laptop',
        price: 58999, salePrice: '54999', image: '1770300505239-hp240r.avif',
        detail: 'Reliable everyday laptop for study, work and entertainment.',
        specifications: 'Intel Core i5, 16GB RAM, 512GB SSD, 14-inch Full HD display'
    },
    {
        category: 'Laptop', brand: 'Dell', name: 'Dell Inspiron 15 Laptop',
        price: 64999, salePrice: '61999', image: '1770299730926-asusvivobook.webp',
        detail: 'A versatile performance laptop with a comfortable full-size keyboard.',
        specifications: 'Intel Core i5, 16GB RAM, 512GB SSD, 15.6-inch Full HD display'
    },
    {
        category: 'Laptop', brand: 'Lenovo', name: 'Lenovo IdeaPad Slim 5',
        price: 72999, salePrice: '69999', image: '1770300028427-asus s16.webp',
        detail: 'Slim, portable laptop built for productivity and multitasking.',
        specifications: 'AMD Ryzen 7, 16GB RAM, 512GB SSD, 15.6-inch IPS display'
    },
    {
        category: 'Mobile', brand: 'Samsung', name: 'Samsung Galaxy A56 5G',
        price: 41999, salePrice: '38999', image: '1769605501592-iphon17.webp',
        detail: 'A smooth 5G smartphone with a bright display and all-day battery.',
        specifications: '6.7-inch AMOLED, 8GB RAM, 128GB storage, 50MP camera, 5G'
    },
    {
        category: 'Mobile', brand: 'Vivo', name: 'Vivo V50 5G',
        price: 34999, salePrice: '32999', image: '1770193434473-reno15pro.jpeg',
        detail: 'Stylish smartphone with portrait photography and fast charging.',
        specifications: '6.77-inch AMOLED, 8GB RAM, 256GB storage, 50MP dual camera'
    },
    {
        category: 'Mobile', brand: 'Realme', name: 'Realme GT 7',
        price: 38999, salePrice: '35999', image: '1770196618705-GT8.jpeg',
        detail: 'Fast, responsive phone designed for gaming and daily performance.',
        specifications: '120Hz AMOLED, 12GB RAM, 256GB storage, 5500mAh battery'
    },
    {
        category: 'LED TV', brand: 'Sony', name: 'Sony Bravia 43-inch 4K TV',
        price: 54999, salePrice: '49999', image: '1770206102115-sonybravia.jpg',
        detail: 'Cinematic 4K viewing with rich colours and smart streaming apps.',
        specifications: '43-inch 4K HDR, Google TV, Dolby Audio, Wi-Fi'
    },
    {
        category: 'LED TV', brand: 'LG', name: 'LG 50-inch 4K UHD Smart TV',
        price: 57999, salePrice: '52999', image: '1770206315361-bravia2.webp',
        detail: 'Large-screen smart TV with vivid picture quality for family viewing.',
        specifications: '50-inch 4K UHD, webOS, HDR10, Bluetooth, 20W speakers'
    },
    {
        category: 'LED TV', brand: 'Samsung', name: 'Samsung Crystal 4K 55-inch TV',
        price: 64999, salePrice: '59999', image: '1770207185466-samsung.png',
        detail: 'Crystal-clear 4K picture and a slim design for modern living rooms.',
        specifications: '55-inch 4K UHD, Tizen OS, HDR, Q-Symphony, Wi-Fi'
    },
    {
        category: 'AirPods', brand: 'Apple', name: 'Apple AirPods 3rd Generation',
        price: 19999, salePrice: '17999', image: '1770372293126-appleairpod2nd.jpeg',
        detail: 'Comfortable wireless earbuds with spatial audio and easy pairing.',
        specifications: 'Spatial audio, H1 chip, sweat resistant, MagSafe charging case'
    },
    {
        category: 'AirPods', brand: 'Boat', name: 'boAt Airdopes 181',
        price: 2499, salePrice: '1999', image: '1770373504031-AD_181_pro_1.avif',
        detail: 'Affordable true wireless earbuds with punchy sound and low latency.',
        specifications: 'Bluetooth 5.3, 10mm drivers, 50 hours playback, IPX4'
    },
    {
        category: 'AirPods', brand: 'Noise', name: 'Noise Buds VS104 Max',
        price: 2999, salePrice: '2299', image: '1770373330212-noiselogo.png',
        detail: 'Lightweight earbuds with clear calls and long-lasting battery life.',
        specifications: 'Bluetooth 5.2, 13mm drivers, 40 hours playback, ENC calls'
    }
];

async function ensureCategory(seed) {
    const existing = await Category.findOne({ Name: seed.name });
    if (existing) {
        return existing;
    }

    const preferredIdInUse = await Category.exists({ _id: seed.preferredId });
    const category = new Category({
        ...(preferredIdInUse ? {} : { _id: seed.preferredId }),
        Name: seed.name,
        Img: seed.image
    });
    return category.save();
}

async function ensureBrand(brandName, category, image) {
    const existing = await Brand.findOne({
        BrandName: brandName,
        Category: category.Name
    });
    if (existing) {
        return { document: existing, added: false };
    }

    return {
        document: await Brand.create({
        BrandName: brandName,
        Category: category.Name,
        Img: image
        }),
        added: true
    };
}

async function ensureProduct(seed, category) {
    const existing = await Product.findOne({
        Category: category._id.toString(),
        Brand: seed.brand,
        ProductName: seed.name
    });
    if (existing) {
        return false;
    }

    await Product.create({
        Category: category._id.toString(),
        ProductName: seed.name,
        ProductPrice: seed.price,
        ProductDetail: seed.detail,
        OnSale: 'Yes',
        SalePrice: seed.salePrice,
        Date: new Date().toISOString(),
        AddedBY: 'Seed',
        VendorID: 'local-demo',
        Img: seed.image,
        Brand: seed.brand,
        Specifications: seed.specifications
    });
    return true;
}

async function seed() {
    await mongoose.connect(MONGO_URI);

    const categories = new Map();
    for (const seedData of categorySeeds) {
        const category = await ensureCategory(seedData);
        categories.set(category.Name, category);
    }

    let brandsAdded = 0;
    for (const [brandName, categoryName, image] of brandSeeds) {
        const result = await ensureBrand(brandName, categories.get(categoryName), image);
        if (result.added) {
            brandsAdded += 1;
        }
    }

    let productsAdded = 0;
    for (const product of productSeeds) {
        if (await ensureProduct(product, categories.get(product.category))) {
            productsAdded += 1;
        }
    }

    const [categoryCount, brandCount, productCount] = await Promise.all([
        Category.countDocuments(),
        Brand.countDocuments(),
        Product.countDocuments()
    ]);

    console.log(`Seed complete: ${categoryCount} categories, ${brandCount} brands, ${productCount} products.`);
    console.log(`Added this run: ${categorySeeds.length} categories checked, ${brandsAdded} brands, ${productsAdded} products.`);
}

seed()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
