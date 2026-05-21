import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const columns = [
  'id', 'name', 'description', 'price', 'discount_price',
  'image_url', 'category', 'stock', 'created_at', 'image',
  'product_category', 'quantity', 'in_stock', 'updated_at'
]

async function probe() {
  const existing = []
  const missing = []

  for (const col of columns) {
    const { error } = await supabase
      .from('products')
      .select(col)
      .limit(1)
    
    if (error) {
      if (error.code === '42703') {
        missing.push(col)
      } else {
        console.error('Error checking column ' + col + ':', error.message)
        missing.push(col)
      }
    } else {
      existing.push(col)
    }
  }

  console.log('Existing columns:', existing.join(', '))
  console.log('Missing columns:', missing.join(', '))
}

probe()
