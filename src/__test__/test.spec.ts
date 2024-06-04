const newFunc = (a: number,b: number)=>{
  return a+b;
}

describe('Basic test', ()=>{
  it('return true num', ()=>{
    const actual = newFunc(1,2)
    expect(actual).toBe(3)
  })
})