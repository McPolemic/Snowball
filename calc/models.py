from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=50, unique=True)
    initial_balance = models.DecimalField(max_digits=9, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=3)
    overpayments = models.BooleanField(default=True)
    minimum_payment = models.DecimalField(max_digits=9, decimal_places=2)

    def __unicode__(self):
        return '%s - %s' % (self.user.username, self.name)

class Transaction(models.Model):
    user = models.ForeignKey(User)
    account = models.ForeignKey(Account)
    date = models.DateField()
    amount = models.DecimalField(max_digits=9, decimal_places=2)

    def __unicode__(self):
        return '%s - %s - $%0.2f' % (self.date.strftime('%m/%d/%y'), self.account.name, self.amount)
