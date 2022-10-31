const http = require('http');
const getBodyData = require('./util')
const { v4 } = require('uuid')

// rest api
// Create, Read, Update, Delete
let books = [
   {
      id: 1,
      title: "Mehrobdan chayon",
      author: "Abdulla Qodiriy"
   },
   {
      id: 2,
      title: "Dunyoning ishlari",
      author: "O'tkir Hoshimov"
   },
   {
      id: 3,
      title: "Odam bo'lish qiyin",
      author: "O'lmas Umarbekov"
   },
   {
      id: 4,
      title: "Sariq devni minib",
      author: "Xudoyberdi To'xtaboyev"
   }
]

// CRUD
// C - Create
// R - Read
// U - Update
// D - Delete

const server = http.createServer(async (req, res) => {
   res.writeHead(200, {
      'Content-Type': 'application/json charset=utf8'
   })
   if(req.url === '/api/books' && req.method === 'GET') {
      const bookJsonData = JSON.stringify(books)
      res.end(bookJsonData)
   } else if(req.url === '/api/book/create' && req.method === 'POST') {
      const data = await getBodyData(req)
      const { title, author } = JSON.parse(data)

      if(title === undefined || author === undefined) {
         const msg = {
            status: 400,
            message: 'Kitob nomi yoki authori kiritilmagan!'
         }
         return res.end(JSON.stringify(msg))
      }

      const newBook = {
         id: v4(),
         title,
         author
      }

      books.push(newBook)

      res.end(JSON.stringify({
         status: 201,
         msg: "Muvaffaqqiyatli qo'shildi",
         books: books
      }))
   } else if(req.url === '/api/book/delete' && req.method === 'DELETE') {
      const data = await getBodyData(req)
      const { id } = JSON.parse(data)

      if(id === undefined) {
         return res.end(JSON.stringify({
            status: 400,
            message: "ID jo'natilmagan"
         }))
      }

      const bookExist = books.filter(item => item.id == id)

      if(bookExist.length == 0) {
         return res.end(JSON.stringify({
            status: 404,
            message: "Bunday ID lik kitob mavjud emas"
         }))
      }

      books = books.filter(item => item.id != id);

      res.end(JSON.stringify({
         status: 200,
         message: "Ma'lumot muvaffaqqiyatli o'chirildi"
      }))
   } else if(req.url === '/api/book/update' && req.method === 'PUT') {
      const data = await getBodyData(req)
      const { id, title, author } = JSON.parse(data)

      if(id === undefined) {
         return res.end(JSON.stringify({
            status: 400,
            message: "ID jo'natilmagan"
         }))
      }

      const bookExist = books.filter(item => item.id == id)

      if(bookExist.length == 0) {
         return res.end(JSON.stringify({
            status: 404,
            message: "Bunday ID lik kitob mavjud emas"
         }))
      }

      bookExist[0].title = title ? title : bookExist[0].title
      bookExist[0].author = author ? author : bookExist[0].author

      res.end(JSON.stringify({
         status: 200,
         message: "Muvaffaqqiyatli o'zgartirildi!"
      }))
   }
})

const port = 3000;
server.listen(port, () => {
   console.log(`Server running on port ${port}`)
})