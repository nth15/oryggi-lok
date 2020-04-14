from selenium import webdriver
from selenium.webdriver.common.keys import Keys

param = "nokkvi"

driver = webdriver.Chrome()
driver.get("http://127.0.0.1:3000/users/search")

element = driver.find_element_by_id("param")
element.send_keys(param)
element.send_keys(Keys.RETURN)
elements = driver.find_element_by_id("Search")
elements.click()

element.close()