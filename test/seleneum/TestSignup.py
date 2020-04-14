from selenium import webdriver
from selenium.webdriver.common.keys import Keys

name = 'nokkvi'
email = 'tettaereg@prufa.is'
phone = 1234567 
text = 'EJEJEJJEJEJEJEJEJEJEJJJJJJJJEJEJEJJEJEJEJEJEJEJEJ'

driver = webdriver.Chrome()
driver.get('http://127.0.0.1:3000/')

element = driver.find_element_by_id('name')
element.send_keys(name)
element = driver.find_element_by_id('email')
element.send_keys(email)
element = driver.find_element_by_id('phone')
element.send_keys(phone)
element = driver.find_element_by_id('text')
element.send_keys(text)
element.send_keys(Keys.RETURN)
elements = driver.find_element_by_id('Signup')
elements.click()

element.close()