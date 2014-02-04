import requests
import json
import random

APP_ID = '572886919'

class Review(object):

    @property
    def url(self):
        return '%s/rss/customerreviews/id=%s/json' % (self.current_domain, self.app_id)

    @property 
    def current_domain(self):
        return 'https://itunes.apple.com/%s' % self.current_store

    @property 
    def current_store(self):
        return self.country_codes[self.country_index].lower()

    @property 
    def country_codes(self):
        return ['AF','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BA','BW','BV','BR','IO','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CY','CZ','DK','DJ','DM','DO','TP','EC','EG','SV','GQ','ER','EE','ET','FK','FO','FJ','FI','FR','FX','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MK','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','AN','NC','NZ','NI','NE','NG','NU','NF','MP','NO','OM','PK','PW','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','KN','LC','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','SS','GS','ES','LK','SH','PM','SD','SR','SJ','SZ','SE','CH','SY','TW','TJ','TZ','TH','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW']

    def __init__(self, app_id):
        self.app_id = app_id
        self.reviews = []
        self.country_index = 0
        self.run()

    def filter_reviews(self, data):
        print 'Filter Reviews'
        if 'entry' not in data['feed']:
            return False

        items = data['feed']['entry']
        
        for item in items:
            if 'im:rating' not in item.keys():
                continue

            if int(item['im:rating']['label']) == 5:
                content = item['content']['label']
                if len(content) < 15:
                    continue
                review = {}
                review['id'] = item['id']['label']
                review['name'] = item['author']['name']['label']
                review['content'] = content
                self.reviews.append(review)

        return True

    def get_next_link(self, data):
        link = data['feed']['link'][5]['attributes']['href']
        link = link.replace('xml', 'json')
        return link

    def is_available_store(self, data):
        next_link = self.get_next_link(data)

        values = next_link.split('/rss/customerreviews')
        if len(values) > 0:
            return values[0] == self.current_domain

        return True

    def run(self):
        if self.country_index >= len(self.country_codes):
            print 'All stores have been processed'
            return

        self.run_with_url(self.url)

    def run_next(self):
        self.country_index += 1
        self.run()


    def run_with_url(self, url):
        print 'Get reviews from %s' % url
        try:
            r = requests.get(url)
        except:
            self.run_next()
            return

        print 'Status Code %d' % r.status_code
        data = r.json()
        if r.status_code == 200:
            #self.filter_reviews(r.json())
            if not self.is_available_store(data):
                print 'reviews not available'
                self.run_next()
            else:
                if not self.filter_reviews(data):
                    print 'All reviews have been processed'
                    self.run_next()
                else:
                    self.run_with_url(self.get_next_link(data))


review = Review(APP_ID)
f = open('reviews.js', 'w')
random.shuffle(review.reviews)
f.write('var reviews = %s'% json.dumps(review.reviews))
f.close()
