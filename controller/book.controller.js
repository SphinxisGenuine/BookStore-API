  const {BOOKS}=require('../MODEL/books')

  exports.getallboooks=function(req,res){
    console.log('GET /books hit')
    res.setHeader('x-sphinx','sphinx')
      res.json(BOOKS) 
  } 
  exports.getbookbyid=function(req,res){
    const id = Number(req.params.id);
      if (isNaN(id)){
          return res.status(400).json({error:`id must be type of number`})
      }
      const book = BOOKS.find((e)=>e.id==id)
  if(!book){
      return res.status(404).json({error: `Book with ${id} does not exist !`})
  }
  else return res.json({book}) 
  }
  exports.postbook=function(req,res){
  const{title,author}=req.body

      if(!title||title===""){
          return res.status(400).json({error:`Tittle is requires`})
      }
      
      if(!author||author===""){
          return res.status(400).json({error:`Author is requires`})
      }
      const id = BOOKS.length+1
  const book={id,title,author}
  BOOKS.push(book)
  return res.status(201).json({message:'book has been created ',id})
      
  }
  exports.delete=function(req,res){
      const id = Number(req.params.id)
      if (isNaN(id)){
          return res.status(400).json({error:'ID SHOULD BE NUMBER '})
      }
  const index= BOOKS.findIndex(e=>e.id===id)
  if(index<0){
      return res
      .status(400)
      .json({error:'Ther is nook book with that id  '})


  }
  BOOKS.splice(index,1)
  return res 
  .json({message:'book hass been deleted '})



  }
